({
  http_event
}) => {
  const payload = JSON.parse(http_event.parsed_body.payload);

  setImmediate(() => {
    if (payload.actions && payload.actions[0]) {
      console.log(payload);
      const action = payload.actions[0].action_id;
      const actingUserId = payload.user.id;
      const action_ts = payload.container.message_ts;
      
      const stashKey = instanceId + "-" + actingUserId; // may want to key just on instance id and fail with error if already present.
      const stashValue = JSON.parse(stash.get(stashKey));
      const channel = stashValue.channel;

      if (action == "approve") {

        const approveValue = payload.actions[0].value;
        const approveObj = JSON.parse(approveValue);
        const approvalUserAlphanumericOnly = approveObj.approvalUser.replace(/[^a-z0-9]/gmi, ""); // because we get it as @<JK234> but want JK234

        if (actingUserId != approvalUserAlphanumericOnly) {
          console.log("unable to process because of commitment");
          let text = "You are not authorized to approve or reject this message.";
          return api.run("this.post_ephemeral_message", {
            text: text,
            channel: channel,
            user: actingUserId
          });
        }

        if (stash.get(action_ts) == "processed") {
          const text = "This request has already been processed. To resize this instance, please go through the flow again.";
          return api.run("this.post_text_only_message", {
            text: text,
            channel: channel,
          });
        }

        const requestUser = api.user({
          type: "slack",
          workspaceId: payload.team.id,
          userId: approveObj.requestUser
        });

        let text = "";
        if (!requestUser) {
          text = `The requesting user, <@${approveObj.requestUser}>, has not been authenticated by the app, so we can't resize the instance. Please configure user settings at ${env.getBuiltin().appUrl}`;
        } else {
          text = "The request to resize instance " + approveObj.instanceId + " was approved by " + approveObj.approvalUser + ". Resizing...";
        }

        api.run("this.post_text_only_message", {
          text: text,
          channel: channel,
        });

        api.run("this.start_resize_ec2_instance", {
          instanceId: approveObj.instanceId,
          newSize: approveObj.newSize,
          channel: approveObj.channel
        }, {
          asUser: requestUser.id
        });
        stash.put(action_ts, "processed");
      }
      if (action == "reject") {
        const rejectValue = payload.actions[0].value;
        const rejectObj = JSON.parse(rejectValue);
        const approvalUserAlphanumericOnly = rejectObj.approvalUser.replace(/[^a-z0-9]/gmi, ""); // because we get it as @<JK234> but want JK234

        if (actingUserId != approvalUserAlphanumericOnly) {
          console.log("unable to process because of commitment");
          let text = "You are not authorized to approve or reject this message.";
          return api.run("this.post_ephemeral_message", {
            text: text,
            channel: channel,
            user: actingUserId
          });
        }

        if (stash.get(action_ts) == "processed") {
          const text = "This request has already been processed. To resize this instance, please go through the flow again.";
          return api.run("this.post_text_only_message", {
            text: text,
            channel: channel,
          });
        }
        const text = "The request to resize instance " + rejectObj.instanceId + " was rejected by " + rejectObj.approvalUser;
        return api.run("this.post_text_only_message", {
          text: text,
          channel: channel,
        });
        stash.put(action_ts, "processed");
      }
      if (/resize-/.exec(action) && payload.actions[0].block_id && payload.actions[0].selected_option && payload.actions[0].selected_option.value) {
        const instanceId = action.replace("resize-", "")
        const stashKey = instanceId + "-" + actingUserId; // may want to key just on instance id and fail with error if already present.
        const stashValue = JSON.parse(stash.get(stashKey));
        const approvalUser = stashValue.approvalUser;
        const newSize = payload.actions[0].selected_option.value;

        const parameters = api.run("this.create_parameters_for_approval", {
          channel: channel,
          user: actingUserId,
          approvalUser: approvalUser,
          instanceId: instanceId,
          newSize: newSize,
          channel: channel
        })[0];

        return api.run("this.post_chat_message", parameters);

      }
    }
  });

  return {
    status_code: 200,
  };
}