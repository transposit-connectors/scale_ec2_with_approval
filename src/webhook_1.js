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

  if (parsed_body.payload) {
    console.log(JSON.parse(parsed_body.payload));
    body = JSON.parse(parsed_body.payload);
    in_initial_call = false;
    workspaceId = body.team.id;
    userId = body.user.id;
  } else {

    console.log(parsed_body);
  }

  console.log("here3");

  const _ = require('underscore.js');
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

  setImmediate(() => {
    console.log("abcd");
    console.log(userId);
    console.log(workspaceId);
    console.log("before");
    let user = api.user({
      type: "slack",
      workspaceId,
      userId
    });
    console.log("after");
    console.log("Abcd");
    if (!in_initial_call) {
      console.log("Abcd2");
      console.log(http_event);
      const parameters = {};

      // console.log(text);
      parameters.http_event = http_event;
      body.actions[0].selected_option
      parameters.text = "saw action";
      // a new instance type has been requested
      parameters.response_type = 'in_channel';

      //return api.run("slack_webhook.respond_to_interaction", parameters);
    }

    if (user) {
      console.log("Abc");
      if (parsed_body.payload) {
        console.log("Abc2");
        const parameters = {};

        // console.log(text);
        parameters.http_event = http_event;
        parameters.text = "saw action";
        // a new instance type has been requested
        return api.run("slack_webhook.respond_to_slash_command", parameters);
      }

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