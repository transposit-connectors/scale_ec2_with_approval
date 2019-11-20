(params) => {
  const moment = require('moment-timezone-with-data.js');

  const text = "Resizing instance " + params.instanceId + ", looking for change to state " + params.stateLookingFor;
  return api.run("this.post_text_only_message", {
    text: text,
    channel: "test5",
  });

  let result = api.query("SELECT instancesSet.item.instanceState.name FROM aws_ec2.describe_instances WHERE $body=(SELECT { 'InstanceId' : [ '" + params.instanceId + "' ] })")[0];
  console.log("help");
  console.log(result);
  console.log(result.name);
  console.log(result.name == params.stateLookingFor);
  if (result.name == params.stateLookingFor) {
    console.log(params.stateLookingFor);
    api.run(params.operationToCall, params.operationParams)
    return;
  }


  const in30seconds = moment().add(30, "seconds").format();
  task.create("this.check_if_ec2_operation_completed", {
    instanceId: params.instanceId
  }).runOnce(in30seconds);
  console.log("running in 30 s");
  return;
}

/*
 * For sample code and reference material, visit
 * https://www.transposit.com/docs/references/js-operations
 */