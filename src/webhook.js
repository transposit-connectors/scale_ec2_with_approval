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
      headers: {
        "Content-Type": "text/plain"
      },
      body: http_event.parsed_body.challenge
    };
  }

  const parsed_body = http_event.parsed_body;
  const workspaceId = parsed_body.team_id;
  const userId = parsed_body.event.user;
  const channel = 'test5';

  const _ = require('underscore.js');

  setImmediate(() => {

    let user = api.user({
      type: "slack",
      workspaceId,
      userId
    });

    if (!user) {
      let text = `Configure user settings at ${env.getBuiltin().appUrl}`;
      return api.run("this.post_text_only_message", {
        text: help_text,
        channel: channel
      })
    }

    const raw_full_command = parsed_body.event.text;
    const raw_command = raw_full_command.substr(raw_full_command.indexOf(">") + 2); // get rid of botusername
    const help_text = "I don't understand the command. Please either 'list-ec2-instances' or ";

    // return api.run("slack.post_chat_message", {text: "abcd", channel: channel});
    if (!raw_command) {
      console.log("didn't see raw command");
      return api.run("this.post_text_only_message", {
        text: help_text,
        channel: channel
      });
    }
    if (raw_command.length < 1) {
      console.log("didn't see raw command length");
      return api.run("this.post_text_only_message", {
        text: help_text,
        channel: channel
      });
    }
    if (!new RegExp(/list-ec2-instances/).exec(raw_command)) {
      console.log("didn't see raw command we understood");
      return api.run("this.post_text_only_message", {
        text: help_text,
        channel: channel
      });
    }

    let command_text = "";



    return api.run("this.post_chat_message", parameters);

  });
  return {
    status_code: 200
  };
}