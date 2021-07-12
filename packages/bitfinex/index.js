/*USAGE:
npm install ws lodash async moment crc-32
mkdir logs
node bfx_test_book.js BTCUSD
*/

const WS = require('ws')
const fs = require('fs')
const CRC = require('crc-32')
const {
  resolve
} = require('path');
const { Console } = require('console');

const host = 'wss://api.bitfinex.com/ws/2';

let ws

/* ... do things for a while ... */

function formatDate(){
  const d = Date.now();
  const millis = d % 1000;
  const pref = new Date(d).toISOString().slice(0,-5);
  return `${pref}|${millis}`;
}


function connect() {
  ws = new WS(host, {
    /* rejectUnauthorized: false */
  })
  
  
  ws.on('error', err => {
    console.log('/event/error')
    console.error(`ERR: error event received: ${String(err)}`);
  });

  
  ws.on('open', () => {
    ws.send(JSON.stringify({
      event: 'conf',
      flags: 65536 + 131072
    }))
    ws.send( JSON.stringify({
      event: 'subscribe',
      channel: 'book',
      prec: 'R0',
      symbol: 'tBTCUSD',
      len: 250
    }));
  })

  
  ws.on('close', (err, code) => {
    console.log('/event/close', err, code);
    console.log(`closed at ${new Date()}`);
    seq = null
  })

  let seq;
  ws.on('message', (data) => {
    const dateStr = formatDate()
    let msg = JSON.parse(data)
    if (msg?.event === 'info') {
      info = msg;
      return;
    }
    if (msg?.event === 'conf') {
      conf = msg;
      return;
    }
    if (msg?.event === 'subscribed') {
      return;
    }
    if (!Array.isArray(msg)) {
      console.error(`ERR: There is an error: ${data}`);
      console.error(`ERR: Error happend at ${new Date()}`);
      ws.close();
      return;
    }
    const channelId = msg[0];
    const payload = msg[1];
    const sequence = msg[1] === 'cs' ? msg[3] : msg[2];
    if (sequence === 1 && seq === undefined) {
      console.log('seq,channelId,datetime,orderid,price,amount');
      seq = 1;
    } else if (sequence - seq !== 1) {
      console.log(`ERR: OUT OF SEQUENCE:${seq}-${sequence}, diff=${sequence - seq}`);
    }
    seq = sequence;
    if (msg[1] === 'hb') {
      if (!Number.isInteger(msg[2])) {
        console.error(`ERR: 'hb' doesnt have integer as payload ${data}`);
        ws.close();
        return;
      }
      seq = msg[2];
      console.log(`${seq},${channelId},${dateStr},hb`);   // heart beat??
      return;
    }
    if (msg[1] === 'cs') {
      console.log(`${seq},${channelId},${dateStr},cs,${msg[2]}`);
      return;
    }


    // receiving snapshot of orderbook
    if (Array.isArray(payload) && payload.length > 4) {
      for (const order of payload) {
        const [orderid, price, amount] = order;
        console.log(`${seq},${channelId},${dateStr},${orderid},${price},${amount}`);
      }
      return;
    }
    const [orderid, price, amount] = payload;
    console.log(`${seq},${channelId},${dateStr},${orderid},${price},${amount}`);
  });
}
connect();