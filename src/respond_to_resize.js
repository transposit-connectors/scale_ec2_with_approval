({ http_event }) => {
  console.log(http_event);
  console.log(http_event.parsed_body.payload);
  console.log(JSON.parse(http_event.parsed_body.payload));
  
  const channel = 'test5'; // XXX pull out to env var

    const payload = JSON.parse(http_event.parsed_body.payload);

   let user = api.user({
      type: "slack",
      payload.team.id,
      payload.user.id
    });

  console.log("user");
  console.log(user);
  setImmediate(() => {
      if (payload.actions && payload.actions[0] && payload.actions[0].block_id && payload.actions[0].selected_option && payload.actions[0].selected_option.value) {
        const instanceId = payload.actions[0].block_id ;
        const stashKey = instanceId + "-" + user.id;
      const approvalUser = stash.get(stashKey);
     return api.run("this.post_text_only_message", {
        text: "saw: "+payload.actions[0].block_id + " / "+ payload.actions[0].selected_option.value + " / "+approvalUser,
        channel: channel
      });
  }
  });

  return {
    status_code: 200,
  };
}
