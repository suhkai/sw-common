const rd = require('readline');
const { resolve } = require('path');
const fs = require('fs');

const readInterface = rd.createInterface({
    input: fs.createReadStream(resolve('jaws-metrics-usage-stats.log')),
    //output: process.stdout,
    console: false
})

readInterface.on('line', line => {
    const fields=line.split(',',);
    //const pl = `${name},${host},${pid},${nrClients},${getConnectionCount},${authFail},${authSuccess},${subscribeFail},${subSuccess},${activityFail},${actSuccess},${onStatFail},${onStatSuccess},${onMsgEventMiss},${onMsgEventHit},${onMsgTargetMiss},${onMsgTargetHit}`;
    const [name, host, pid,nrClient, ...rest] = fields;
    if (name === 'edsNotification'){
        console.log(line);
        return;
        const [
            getConnectionCount,
            authFail,
            authSuccess,
            subscribeFail,
            subSuccess,
            activityFail,
            actSuccess,
            onStatFail,
            onStatSuccess,
            onMsgEventMiss,
            onMsgEventHit,
            onMsgTargetMiss,
            onMsgTargetHit
        ] = rest;
        console.log(onMsgEventMiss,onMsgEventHit);
    }
});
