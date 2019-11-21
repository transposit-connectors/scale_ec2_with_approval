(params) => {
  const text = "Resizing instance " + params.instanceId + "...";
  api.run("this.post_text_only_message", {
    text: text,
    channel: params.channel
  });
  const modifySql = "SELECT * FROM aws_ec2.modify_instance_attribute WHERE $body=(SELECT { 'Attribute' : 'instanceType', 'InstanceId' : '" +
    params.instanceId + "', 'InstanceType' : { 'Value' : '" + params.newSize + "'} })"

  let result = api.query(modifySql)[0];

  if (result.ModifyInstanceAttributeResponse.return) { // is this async as well?
    let startResult = api.query("SELECT * FROM aws_ec2.start_instances WHERE $body=(SELECT { 'InstanceId' : [ '" + params.instanceId + "' ] })");

    const resizeCompleteParams = {};
    resizeCompleteParams.instanceId = params.instanceId;
    resizeCompleteParams.channel = params.channel;
    api.run("this.check_if_ec2_operation_completed", {
      instanceId: params.instanceId,
      stateLookingFor: "running",
      operationToCall: "this.resize_complete",
      operationParams: resizeCompleteParams
    });
  }
}