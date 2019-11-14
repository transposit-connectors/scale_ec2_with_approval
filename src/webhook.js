/**
 * This operation is an example of a JavaScript operation deployed as a Webhook
 * and configured to work with Slack.
 *
 * For sample code and reference material, visit
 * https://www.transposit.com/docs/building/webhooks
 */
({
    http_event
}) => {
    const parsed_body = http_event.parsed_body;
    if (parsed_body.payload) {
        console.log(JSON.parse(parsed_body.payload));
    } else {
        console.log(parsed_body);
    }
    const workspaceId = parsed_body.team_id;
    const userId = parsed_body.user_id;
    const _ = require('underscore.js');
    const types = ['t2.nano', 't2.micro', 't2.small', 't2.medium', 't2.large', 't2.xlarge', 't2.2xlarge'];
    const options = [];
    options.concat(types.map(t=>{
      return { text: {         "type": "plain_text",
                                "text": t,
                      "emoji" :false
                     },
              value: t
             };
    }));

    setImmediate(() => {
        let user = api.user({
            type: "slack",
            workspaceId,
            userId
        });
        if (user) {

            let approving_user = "required";
            if (parsed_body.text) {
                approving_user = parsed_body.text;
            }
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
                    "options": options
                }
            };
            parameters.blocks = [{
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Resize an instance, will ask " + approving_user + " for approval"
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

            parameters.response_type = 'in_channel';

            return api.run("slack_webhook.respond_to_slash_command", parameters);
        } else {
            let text = `Configure user settings at ${env.getBuiltin().appUrl}`;
            api.run("slack_webhook.respond_to_slash_command", {
                http_event,
                text
            });
        }
    });
    return api.run("slack_webhook.acknowledge_slash_command");
}