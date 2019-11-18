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
  const channel = 'test5'; // XXX pull out to env var

  const _ = require('underscore.js');

  setImmediate(() => {
    console.log(http_event);

    let user = api.user({
      type: "slack",
      workspaceId: workspaceId,
      userId: userId
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
    const help_text = "I don't understand the command. \n\nPlease either 'list-ec2-instances' or 'resize-ec2-instance \"instance-id\", approver: @name'";

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

    const list_cmd = new RegExp(/list-ec2-instances/).exec(raw_command) != null;
    const resize_cmd = new RegExp(/resize-ec2-instances/).exec(raw_command) != null;
    if (!(list_cmd || resize_cmd)) {
      console.log("didn't see raw command we understood");
      console.log(resize_cmd);
      console.log(raw_command);
      return api.run("this.post_text_only_message", {
        text: help_text,
        channel: channel
      });
    }

    if (list_cmd) {
      const parameters = api.run("this.create_parameters_for_list_instances", {
        channel: channel,
        user: user
      })[0];
      return api.run("this.post_chat_message", parameters);
    }
    if (resize_cmd) {
      const command_array = raw_command.split(/ +/).filter(s => {return s && s.length >0});
      
      if (command_array.length != 4) {
        console.log("didn't see resize command we understood");
        console.log(command_array);
        console.log(raw_command);
        return api.run("this.post_text_only_message", {
          text: help_text + " [saw " + raw_command + "]",
          channel: channel
        });
      }
      const instanceId = command_array[1];
      const approvalUser = command_array[3];
      const stashKey = instanceId + "-" + user.id;
      stash.put(stashKey,approvalUser);
      const parameters = api.run("this.create_parameters_for_resize_instances", {
        channel: channel,
        user: user,
        instanceId: instanceId
      })[0];

      return api.run("this.post_chat_message", parameters);
    }


  });

  return {
    status_code: 200
  };
}