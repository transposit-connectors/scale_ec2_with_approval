(params) => {
  
  // let result = api.query("SELECT * FROM aws_ec2.stop_instances WHERE $body=(SELECT { 'InstanceId' : [ '"+params.instanceId+"' ] })");
  // let result = api.query("SELECT * FROM aws_ec2.describe_instances WHERE $body=(SELECT { 'InstanceId' : [ '"+params.instanceId+"' ] })");
  // const modifySql = "SELECT * FROM aws_ec2.modify_instance_attribute WHERE $body=(SELECT { 'Attribute' : 'instanceType', 'InstanceId' : '"+
  //                        params.instanceId+"', 'InstanceType' : { 'Value' : '"+params.newSize+"'} })"
  // console.log(modifySql);
  // let result = api.query(modifySql); 
  
  // let result = api.query("SELECT * FROM aws_ec2.start_instances WHERE $body=(SELECT { 'InstanceId' : [ '"+params.instanceId+"' ] })");
  
  return result;                       

  // https://console.staging.transposit.com/t/yoko/growth_bot/code/op/z_deprecated_check_status_and_post for await
  return {
    success: true
  };
}
