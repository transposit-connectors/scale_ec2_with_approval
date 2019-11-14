/**
 * This operation is an example of a JavaScript operation deployed as a Webhook
 * and configured to work with Slack.
 *
 * For sample code and reference material, visit
 * https://www.transposit.com/docs/building/webhooks
 */
({ http_event }) => {
  const parsed_body = http_event.parsed_body;
  const workspaceId = parsed_body.team_id;
  const userId = parsed_body.user_id;

  setImmediate(() => {
    let user = api.user({type: "slack", workspaceId, userId});
    if (user) {
      
       const parameters = {};
      const instances = api.run("this.describe_instances", {}, {asUser: user.id});
      let text = "";
      instances.forEach(i => {
        text += "* " + i.id + " - " + i.state + " - " + i.type;
      });
  parameters.http_event = http_event;
  
  parameters.blocks = [
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": text
        }
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "datepicker",
                "action_id": "start_date",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Start date"
                }
            }
          ]
    }];
  parameters.response_type = 'ephemeral';
  
  return api.run("slack_webhook.respond_to_slash_command", parameters);
    } else {
      let text = `Configure user settings at ${env.getBuiltin().appUrl}`;
      api.run("slack_webhook.respond_to_slash_command", { http_event, text });
    }
  });
  return api.run("slack_webhook.acknowledge_slash_command");
}

