({
  http_event
}) => {
  console.log(http_event);
  console.log(http_event.parsed_body.payload);
  console.log(JSON.parse(http_event.parsed_body.payload));

  const channel = 'test5'; // XXX pull out to env var

  const payload = JSON.parse(http_event.parsed_body.payload);

  let user = api.user({
    type: "slack",
    workspaceId: payload.team.id,
    userId: payload.user.id
  });

  // console.log("user");
  // console.log(user);
  setImmediate(() => {
    if (payload.actions && payload.actions[0]) {
      const action = payload.actions[0].action_id;
      console.log(action);
      if (action == "approve" || action == "reject") {
        console.log("got into approval/disapproval block");
        console.log(payload.actions[0].value);
      }
      if (/resize-/.exec(action) && payload.actions[0].block_id && payload.actions[0].selected_option && payload.actions[0].selected_option.value) {
        const instanceId = action.replace("resize-","")
        const stashKey = instanceId + "-" + user.id; // may want to key just on instance id and fail with error if already present.
        const approvalUser = stash.get(stashKey);
        const newSize = payload.actions[0].selected_option.value;
        // present button to approvalUser
        // handle either case and update this message.
        // do we want this to be threaded?
        const parameters = api.run("this.create_parameters_for_approval", {
          channel: channel,
          user: user,
          // approvalUser: approvalUser,
          // instanceId: instanceId,
          // newSize: newSize
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