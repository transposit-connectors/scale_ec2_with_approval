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
    let body = parsed_body;
    let in_initial_call = true;
    let workspaceId = body.team_id;
    let userId = body.user_id;

    const _ = require('underscore.js');
  
    setImmediate(() => {

        let user = api.user({
            type: "slack",
            workspaceId,
            userId
        });
   
        if (user) {

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