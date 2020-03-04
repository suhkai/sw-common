const WebSocket = require('ws');
const colors = require('colors');
const jxpath = require('@mangos/jxpath');
const path = require('path');
const fs = require('fs')

async function init() {
    let ws;

    const set = new Set();

    const findMemberId = jxpath('/**/[/(memberId|memberid|member\\-id|member_id)/=/.*/]');

    function start() {
        ws = new WebSocket('ws://10.135.130.12:10105');
        decorateWebsocket(ws);
    }
    function decorateWebsocket(ws) {
        ws.addEventListener('message', event => {
            const { headers, payload: raw} = JSON.parse(event.data);
            if (headers['message-type'] === 'relay/stat'){
                return;
            }
            const routingKey = headers.event;
            const payload = JSON.parse(raw);
            try{ 
                payload.body = JSON.parse(payload.body);
            }
            catch (err){

            }
            iterator = findMemberId(payload.body);
            const value = iterator.next();
            if (value.done === false){
                const fileName = path.resolve('data', routingKey);
                fs.appendFileSync(fileName, JSON.stringify(headers, null, 4)+JSON.stringify(payload, null, 4)+'\n');
                if (!set.has(routingKey)){
                    set.add(routingKey);
                    console.log(routingKey, set.size);
                }
            }
        });
        ws.addEventListener('close', ({ code, reason }) => {
            console.log(`close event received code:${code}, reason: ${reason}`.red);
            start();
        });
        ws.addEventListener('open', () => {
            console.log('opened'.green);
        });
    }
    return start();
}

init();









