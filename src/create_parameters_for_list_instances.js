(params) => {

  const parameters = {};

  parameters.channel = params.channel;
  parameters.action_id = "list";
  const user = params.user;
  parameters.blocks = [{
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "Instances in your account"
    }
  }];
  const instances = api.run("this.describe_instances", {}, {
    asUser: user.id
  });
  // let text = "";
  instances.forEach(i => {
    const obj = {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "XXX REPLACE ME"
      },
    };
    obj.text.text = i.id + " - " + i.type + " - " + i.state;
    parameters.blocks.push(obj);
  });

  return parameters;
}