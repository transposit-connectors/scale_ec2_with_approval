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
  
  if (http_event.parsed_body.challenge) {
  return {
    status_code: 200,
    headers: { "Content-Type": "text/plain" },
    body: http_event.parsed_body.challenge
  };
}
  
  
    const parsed_body = http_event.parsed_body;
  console.log(parsed_body);
    let body = parsed_body;
    let in_initial_call = true;
    let workspaceId = body.team_id;
    let userId = body.event.user;

  console.log(userId);
  console.log(workspaceId);
    const _ = require('underscore.js');
  
    setImmediate(() => {
  
      console.log("here1");
        let user = api.user({
            type: "slack",
            workspaceId,
            userId
        });
   
      console.log("here2");
      console.log(body.event.text);
      const raw_full_command = body.event.text;
      const raw_command = raw_full_command.substr(raw_full_command.indexOf(" ") + 1);
      const help_text = `I don't understand the command. Please either "list-ec2-instances" or `;
      console.log(raw_command);

      if (! raw_command ){
         return api.run("slack.post_chat_message", {text: help_text, channel: 'test5'});
      }
      let command_text = "";
        if (user) {

            if (parsed_body.text) {
                approving_user = parsed_body.text;
            }
          console.log("here3");
            const parameters = {};

            // console.log(text);
            parameters.channel = "test5";
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

          console.log(parameters);
            return api.run("this.post_chat_message", parameters);
        } else {
            let text = `Configure user settings at ${env.getBuiltin().appUrl}`;
            return api.run("slack.post_chat_message", {text: text, channel: 'test5'});
        }
    });
    return { status_code: 200 };
}