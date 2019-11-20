(params) => {
 console.log("instrz1 ");
  const text = "Beginning resizing instance " + params.instanceId;
  api.run("this.post_text_only_message", {
    text: text,
    channel: "test5",
  });

  console.log("instrz2");
  let result = api.query("SELECT * FROM aws_ec2.stop_instances WHERE $body=(SELECT { 'InstanceId' : [ '" + params.instanceId + "' ] })");

  console.log("instrz3");
  const resizeInstanceParams = {};
  resizeInstanceParams.instanceId = params.instanceId;
  resizeInstanceParams.newSize = params.newSize;
  api.run("this.check_if_ec2_operation_completed", {
    instanceId: params.instanceId,
    stateLookingFor: "stopped",
    operationToCall: "this.resize_instance",
    operationParams: resizeInstanceParams
  });
  
}