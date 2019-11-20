(params) => {
  const text = "Resizing instance " + params.instanceId + "...";
  return api.run("this.post_text_only_message", {
    text: text,
    channel: channel,
  });
  const modifySql = "SELECT * FROM aws_ec2.modify_instance_attribute WHERE $body=(SELECT { 'Attribute' : 'instanceType', 'InstanceId' : '" +
    params.instanceId + "', 'InstanceType' : { 'Value' : '" + params.newSize + "'} })"
  console.log(modifySql);
  let result = api.query(modifySql);
  if (result.success) {
    let startResult = api.query("SELECT * FROM aws_ec2.start_instances WHERE $body=(SELECT { 'InstanceId' : [ '" + params.instanceId + "' ] })");

    const resizeCompleteParams = {};
    resizeCompleteParams.instanceId = params.instanceId;
    api.run("this.check_if_ec2_operation_completed", {
      instanceId: params.instanceId,
      stateLookingFor: "running",
      operationToCall: "this.resize_complete",
      operationParams: resizeCompleteParams
    });
  }
}
}