(params) => {

  const text = "Beginning resizing instance " + params.instanceId;
  return api.run("this.post_text_only_message", {
    text: text,
    channel: channel,
  });

  let result = api.query("SELECT * FROM aws_ec2.stop_instances WHERE $body=(SELECT { 'InstanceId' : [ '" + params.instanceId + "' ] })");

  const resizeInstanceParams = {};
  resizeInstanceParams.instanceId = params.instanceId;
  resizeInstanceParams.newSize = params.newSize;
  api.run("this.check_if_ec2_operation_completed", {
    instanceId: params.instanceId,
    stateLookingFor: "stopped",
    operationToCall: "this.resize_instance",
    operationParams: resizeInstanceParams
  });
  // let result = api.query("SELECT instancesSet.item.instanceState.name FROM aws_ec2.describe_instances WHERE $body=(SELECT { 'InstanceId' : [ '"+params.instanceId+"' ] })");
  // const modifySql = "SELECT * FROM aws_ec2.modify_instance_attribute WHERE $body=(SELECT { 'Attribute' : 'instanceType', 'InstanceId' : '"+
  //                        params.instanceId+"', 'InstanceType' : { 'Value' : '"+params.newSize+"'} })"
  // console.log(modifySql);
  // let result = api.query(modifySql); 

  // let result = api.query("SELECT * FROM aws_ec2.start_instances WHERE $body=(SELECT { 'InstanceId' : [ '"+params.instanceId+"' ] })");


  // https://console.staging.transposit.com/t/nina/test_modules_initial/code/op/EcsCheckServiceEvents
  return result;

  return {
    success: true
  };
}