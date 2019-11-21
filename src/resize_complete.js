(params) => {

  let result = api.query("SELECT instancesSet.item.instanceState.name FROM aws_ec2.describe_instances WHERE $body=(SELECT { 'InstanceId' : [ '" + params.instanceId + "' ] })")[0];

  let text = "Resizing instance " + params.instanceId + " failed. Please investigate.";
  if (result.name == "running") {
    text = "Resizing instance " + params.instanceId + " succeeded and it's up and running again.";
  }
  return api.run("this.post_text_only_message", {
      text: text,
      channel: "test5",
    });
}