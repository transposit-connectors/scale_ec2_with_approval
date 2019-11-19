(params) => {
  const _ = require('underscore.js');

  const parameters = {};


  parameters.channel = params.channel;
  const user = params.user;
  const value = {};
  value.instanceId = params.instanceId;
  value.newSize = params.newSize;
  value.requestUser = params.user.id;
  value.approvalUser = params.approvalUser;
  const valueStr = JSON.stringify(value);
  
  console.log(user);
  parameters.blocks = [{
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": params.approvalUser+", do you want to approve or reject the proposal to resize instance "+params.instanceId+" to a size: "+params.newSize+", from user: "+params.user.fullName+""
      }
    },
    {
      "type": "actions",
      "elements": [{
          "type": "button",
          "action_id": "approve",
          "text": {
            "type": "plain_text",
            "text": "Approve",
            "emoji": true
          },
          "value": valueStr
        },

        {
          "type": "button",
          "action_id": "reject",
          "text": {
            "type": "plain_text",
            "text": "Reject",
            "emoji": true
          },
          "value": valueStr
        }
      ]
    }
  ];

  return parameters;
}