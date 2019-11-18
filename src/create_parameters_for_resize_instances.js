(params) => {
  const _ = require('underscore.js');

  const parameters = {};


  parameters.channel = params.channel;
  const user = params.user;

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
    },
    "accessory": {
      "type": "static_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select a new instance type",
        "emoji": true
      },
      "options": [...options]
    }
  };

}

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