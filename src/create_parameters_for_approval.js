(params) => {
  const _ = require('underscore.js');

  const parameters = {};


  parameters.channel = params.channel;
  const user = params.user;
  // parameters.action_id = "approve";

  parameters.blocks = [{
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": params.approvalUser+", do you want to approve or reject the proposal to resize instance "+params.instanceId+" to a size: "+params.newSize+" from user <"+params.user.id+">"
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
          "value": "approve"
        },

        {
          "type": "button",
          "action_id": "reject",
          "text": {
            "type": "plain_text",
            "text": "Reject",
            "emoji": true
          },
          "value": "reject"
        }
      ]
    }
  ];

  return parameters;
}