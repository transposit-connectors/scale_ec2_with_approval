(params) => {
  const moment = require('moment-timezone-with-data.js');

  let result = api.query("SELECT instancesSet.item.instanceState.name FROM aws_ec2.describe_instances WHERE $body=(SELECT { 'InstanceId' : [ '"+params.instanceId+"' ] })");
  console.log("help");
  console.log(result);
  if (result.name == "stopped") {
    console.log("stopped");
    // call another operation??
    return;
  } 
  
  
  const in30seconds = moment().add(30, "seconds").format();
  task.create("this.check_if_ec2_shutdown_operation_completed", {instanceId: params.instanceId}).runOnce(in30seconds);
  console.log("running in one min");
  return;
}

/*
 * For sample code and reference material, visit
 * https://www.transposit.com/docs/references/js-operations
 */