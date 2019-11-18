({ http_event }) => {
  console.log(http_event);
  console.log(http_event.parsed_body.payload);
  console.log(JSON.parse(http_event.parsed_body.payload));
  
  const channel = 'test5'; // XXX pull out to env var

  const payload = JSON.parse(http_event.parsed_body.payload);
  if (payload.actions && payload.actions[0] && payload.actions[0].block_id && payload.actions[0].selected_option && payload.actions[0].selected_option.value) {
     return api.run("this.post_text_only_message", {
        text: "saw: "+payload.actions[0].block_id + " / "+ payload.actions[0].selected_option.value,
        channel: channel
      });
  }
  return {
    status_code: 200,
  };
}
