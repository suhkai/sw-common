local cjson = require('cjson');
text = cjson.encode('{ "hello":"world" }');
type text;

eval 'local json = \'{"some_object":{},"foo":4}\'; local o = cjson.decode(json); return o' 0

job = {
 info={
  interval:20000,
   // values in $pk are part of the unique job identifier
  $pk:[performerId, memberNumericId, 'billingPrivate'], object 
},
task: {
// note "actionType" and "actionName" are part of the unique job identifier
  actionType:'rpc',
  actionName: this._config.api.rpc.pay,
  args:{
      sessionid:sessionId,
      performerid:performerId,
      memberid:id,
      time:20,
      showid:showId,
      isVibratorOn:0,
      isTwoWayAudioInProgress:0,
      isCamToCamInProgress:0,
  }
},
onError: {}, // optional has the same properties as "task"
onSuccess: {} // optional has the same properties as "task"
},

(err, result) => {...} // callback

);