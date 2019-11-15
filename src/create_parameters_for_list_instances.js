(params) => {
  
    const parameters = {};

    parameters.channel = params.channel;
    const one_section = {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "XXX REPLACE ME"
      },

    };
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
      const obj = _.clone(one_section);
      obj.text.text = i.id + " - " + i.type + " - " + i.state;
      parameters.blocks.push(obj);
    });
  
  return parameters;
}
