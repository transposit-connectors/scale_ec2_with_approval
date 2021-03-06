(params) => {
  const _ = require('underscore.js');

  const parameters = {};

  parameters.channel = params.channel;
  const user = params.user;

  parameters.blocks = [];

  const types = ['t2.nano', 't2.micro', 't2.small', 't2.medium', 't2.large', 't2.xlarge', 't2.2xlarge'];
  const options = types.map(t => {
    return {
      text: {
        "type": "plain_text",
        "text": t,
        "emoji": false
      },
      value: t
    };
  });
  const one_section = {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "XXX REPLACE ME"
    }
  };
  const one_dd = {
    "type": "actions",
    "elements": [{
      "type": "static_select",
      "action_id": "resize-" + params.instanceId,
      "placeholder": {
        "type": "plain_text",
        "text": "Select a new instance type",
        "emoji": true
      },
      "options": [...options]
    }]
  };

  const instances = api.run("this.describe_instances", {}, {
    asUser: user.id,
  }).filter(i => {
    return i.id == params.instanceId
  });

  instances.forEach(i => {
    const obj = _.clone(one_section);
    obj.text.text = i.id + " - " + i.type + " - " + i.state + ". Change to: ";
    parameters.blocks.push(obj);
    parameters.blocks.push(one_dd);
  });

  return parameters;
}