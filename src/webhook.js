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
    let workspaceId = parsed_body.team_id;
    let userId = parsed_body.event.user;

    const _ = require('underscore.js');
  
    setImmediate(() => {
  
        let user = api.user({
            type: "slack",
            workspaceId,
            userId
        });
   
      const raw_full_command = body.event.text;
      const raw_command = raw_full_command.substr(raw_full_command.indexOf(">") + 2); // get rid of botusername
      const help_text = "I don't understand the command. Please either 'list-ec2-instances' or ";

      // return api.run("slack.post_chat_message", {text: "abcd", channel: 'test5'});
      if (! raw_command ){
        console.log("didn't see raw command");
         return api.run("this.post_text_only_message", {text: help_text, channel: 'test5'});
      }
      if (raw_command.length < 1) {
        console.log("didn't see raw command length");
         return api.run("this.post_text_only_message", {text: help_text, channel: 'test5'});
      }
      if (! /list-ec2-instances/.match(raw_command)) {
        console.log("didn't see raw command we understood");
                return api.run("this.post_text_only_message", {text: help_text, channel: 'test5'});
      }
      let command_text = "";
        if (user) {

            const parameters = {};

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

            return api.run("this.post_chat_message", parameters);
        } else {
            let text = `Configure user settings at ${env.getBuiltin().appUrl}`;
            return api.run("this.post_text_only_message", {text: help_text, channel: 'test5'})
        }
    });
    return { status_code: 200 };
}
