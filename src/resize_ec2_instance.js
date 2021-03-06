(params) => {
  const text = "Beginning resizing instance " + params.instanceId;
  api.run("this.post_text_only_message", {
    text: text,
    channel: params.channel,
  });

  let result = api.query("SELECT * FROM aws_ec2.stop_instances WHERE $body=(SELECT { 'InstanceId' : [ '" + params.instanceId + "' ] })");

  const resizeInstanceParams = {};
  resizeInstanceParams.instanceId = params.instanceId;
  resizeInstanceParams.newSize = params.newSize;
  resizeInstanceParams.channel = params.channel;
  api.run("this.check_if_ec2_operation_completed", {
    instanceId: params.instanceId,
    stateLookingFor: "stopped",
    operationToCall: "this.resize_instance",
    operationParams: resizeInstanceParams
  });

}