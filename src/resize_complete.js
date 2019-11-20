(params) => {

  let result = api.query("SELECT * FROM aws_ec2.stop_instances WHERE $body=(SELECT { 'InstanceId' : [ '" + params.instanceId + "' ] })");

  result = api.query("SELECT * FROM aws_ec2.start_instances WHERE $body=(SELECT { 'InstanceId' : [ '" + params.instanceId + "' ] })");

  if (result.success) {
    const text = "Resizing instance " + approveObj.instanceId + " succeeded";
    return api.run("this.post_text_only_message", {
      text: text,
      channel: "test5",
    });
  } else {
    const text = "Resizing instance " + approveObj.instanceId + " failed";
    return api.run("this.post_text_only_message", {
      text: text,
      channel: "test5",
    });
  }

  // https://console.staging.transposit.com/t/nina/test_modules_initial/code/op/EcsCheckServiceEvents
  return result;

}