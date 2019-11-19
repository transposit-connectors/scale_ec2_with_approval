({
  http_event
}) => {
  console.log(http_event);
  console.log(http_event.parsed_body.payload);
  console.log(JSON.parse(http_event.parsed_body.payload));

  const channel = 'test5'; // XXX pull out to env var

  const payload = JSON.parse(http_event.parsed_body.payload);
  
  setImmediate(() => {
    if (payload.actions && payload.actions[0]) {
      const action = payload.actions[0].action_id;
      const actingUserId = payload.user.id;
      console.log(action);
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
        
        const text = "The request to resize instance "+ approveObj.instanceId + " was approved by " + approveObj.approvalUser + ". Resizing...";
        return api.run("this.post_text_only_message", {
            text: text,
            channel: channel, 
        });
        
        const result = api.run("this.resize_ec2_instance", {instanceId: approveObj.instanceId, newSize: approveObj.newSize});
        
        if (result.success) { 
            const text = "Resizing instance "+ approveObj.instanceId + " succeeded";
        return api.run("this.post_text_only_message", {
            text: text,
            channel: channel, 
        });
        } else {
            const text = "Resizing instance "+ approveObj.instanceId + " failed";
        return api.run("this.post_text_only_message", {
            text: text,
            channel: channel, 
        });
        }
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
        const text = "The request to resize instance "+ rejectObj.instanceId + " was rejected by " + rejectObj.approvalUser;
        return api.run("this.post_text_only_message", {
            text: text,
            channel: channel, 
          });
        
      }
      if (/resize-/.exec(action) && payload.actions[0].block_id && payload.actions[0].selected_option && payload.actions[0].selected_option.value) {
        const instanceId = action.replace("resize-","")
        const stashKey = instanceId + "-" + actingUserId; // may want to key just on instance id and fail with error if already present.
        const approvalUser = stash.get(stashKey);
        const newSize = payload.actions[0].selected_option.value;
        // present button to approvalUser
        // handle either case and update this message.
        // do we want this to be threaded?
        const parameters = api.run("this.create_parameters_for_approval", {
          channel: channel,
          user: actingUserId,
          approvalUser: approvalUser,
          instanceId: instanceId,
          newSize: newSize
        })[0];

        console.log(parameters);
        return api.run("this.post_chat_message", parameters);

        // return api.run("this.post_text_only_message", {
        // text: "Great, will ask "+approvalUser+ " to approve changing instance: "+instanceId+ "  to this new size: "+ newSize,
        // channel: channel
        // });
      }
    }
  });

  return {
    status_code: 200,
  };
}