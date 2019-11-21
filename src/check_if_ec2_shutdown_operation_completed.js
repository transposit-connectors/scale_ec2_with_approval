(params) => {
  const moment = require('moment-timezone-with-data.js');

  const text = "Resizing instance " + params.instanceId + ", looking for change to state " + params.stateLookingFor;
  api.run("this.post_text_only_message", {
    text: text,
    channel: params.operationParams.channel,
  });

  let result = api.query("SELECT instancesSet.item.instanceState.name FROM aws_ec2.describe_instances WHERE $body=(SELECT { 'InstanceId' : [ '" + params.instanceId + "' ] })")[0];
  if (result.name == params.stateLookingFor) {
    api.run(params.operationToCall, params.operationParams)
    return;
  }


  const in15seconds = moment().add(15, "seconds").format();
  task.create("this.check_if_ec2_operation_completed", {
    instanceId: params.instanceId,
    stateLookingFor: params.stateLookingFor,
    operationToCall: params.operationToCall,
    operationParams: params.operationParams
  }).runOnce(in15seconds);
  console.log("running in 15 s");
}

/*
 * For sample code and reference material, visit
 * https://www.transposit.com/docs/references/js-operations
 */