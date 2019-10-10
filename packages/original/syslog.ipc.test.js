const dns = require('dns'); // for use with ip transport of syslog (check remote target first).
const dgram = require('dgram'); // for use with syslog udp transport
const net = require('net');

const months= [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec' 
];

const severity = 4; // warning
const facility = 23; // local7
const priority = facility*8+severity;
const ts = new Date;
const month = months[ts.getMonth()];
const dom = String(ts.getDate()).padStart(2,'0');
const hours = String(ts.getHours()).padStart(2,'0');
const min = String(ts.getMinutes()).padStart(2,'0');
const sec = String(ts.getSeconds()).padStart(2,'0');
const tag = 'error_lubet_eds_relay_batch';
const hostname = 'PC555';
const msg = `<${priority}>${month} ${dom} ${hours}:${min}:${sec} ${hostname} ${tag}: [Warning] This is a warning, sent through unix sockets\n`;

/*
   only used when running remote
   const target = '10.128.130.18';
   const port = 51409;
*/

const socket = net.createConnection('/dev/log', () => {
	const msgBuffer = Buffer.from(msg, 'utf8');
	console.log(`sending ${msg}`);
	socket.write(msgBuffer, ()=>{
		console.log('...data written to syslog');
		socket.end();
	});
});

socket.setNoDelay(true); // nodelay 
socket.setTimeout(3000); // 

socket.on('error', err => {
	console.log(`there was an error on the ipc socket; ${String(err)}`);
});

socket.on('close', () => {
	console.log(`there was an physical close on the ipc socket`);
});

socket.on('end', () => {
	console.log(`the other 'end' event; (counterparty) closed the socket`);
});

socket.on('timeout', () => {
	console.error('socket timed out');
	socket.end();
});
