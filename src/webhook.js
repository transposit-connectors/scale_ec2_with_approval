/**
 * This operation is an example of a JavaScript operation deployed as a Webhook
 * and configured to work with Slack.
 *
 * For sample code and reference material, visit
 * https://www.transposit.com/docs/building/webhooks
 */
({ http_event }) => {
  const parsed_body = http_event.parsed_body;
  console.log(JSON.parse(parsed_body.payload));
  const workspaceId = parsed_body.team_id;
  const userId = parsed_body.user_id;
  const _ = require('underscore.js');

  setImmediate(() => {
    let user = api.user({type: "slack", workspaceId, userId});
    if (user) {
      
       const parameters = {};
      
      // console.log(text);
  parameters.http_event = http_event;
  const one_section = {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "You can add a button alongside text in your message. "
			},
			"accessory": {
		"type": "static_select",
		"placeholder": {
			"type": "plain_text",
			"text": "Select an item",
			"emoji": true
		},
		"options": [{
				"text": {
					"type": "plain_text",
					"text": "Choice 1",
					"emoji": true
				},
				"value": "value-0"
			},
			{
				"text": {
					"type": "plain_text",
					"text": "Choice 2",
					"emoji": true
				},
				"value": "value-1"
			},
			{
				"text": {
					"type": "plain_text",
					"text": "Choice 3",
					"emoji": true
				},
				"value": "value-2"
			}
		]
	}
		};
  parameters.blocks = [
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "hi"
        }
    }];     
      const instances = api.run("this.describe_instances", {}, {asUser: user.id});
      // let text = "";
      instances.forEach(i => {
        const obj = _.clone(one_section);
        obj.text.text = i.id + " - " + i.type + " - " + i.state;
        parameters.blocks.push(obj);
      });
    
      
      
 
  
    // {
    //     "type": "actions",
    //     "elements": [
    //         {
    //             "type": "datepicker",
    //             "action_id": "start_date",
    //             "placeholder": {
    //                 "type": "plain_text",
    //                 "text": "Start date"
    //             }
    //         }
    //       ]
    // }];
  parameters.response_type = 'in_channel';
  
  return api.run("slack_webhook.respond_to_slash_command", parameters);
    } else {
      let text = `Configure user settings at ${env.getBuiltin().appUrl}`;
      api.run("slack_webhook.respond_to_slash_command", { http_event, text });
    }
  });
  return api.run("slack_webhook.acknowledge_slash_command");
}

