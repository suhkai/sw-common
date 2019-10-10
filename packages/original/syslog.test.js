const dns = require('dns');
const dgram = require('dgram');
const months= [ 'Jan',
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
const mesg = '[19251]: [Warning] Some warning message'
const priority = facility*8+severity;
const ts = new Date;
const month = months[ts.getMonth()];
const dom = String(ts.getDate()).padStart(2,'0');
const hours = String(ts.getHours()).padStart(2,'0');
const min = String(ts.getMinutes()).padStart(2,'0');
const sec = String(ts.getSeconds()).padStart(2,'0');
const tag = 'error_lubet_eds_relay_batch';
const hostname = 'PC555';
const msg = `<${priority}>${month} ${dom} ${hours}:${min}:${sec} ${hostname} ${tag}: [Warning] This is a warning\n`;
console.log(`sending ${msg}`);
const target = '10.128.130.18';
const port = 514;

dns.lookup(target, { verbatim: true }, (err, address, family) => {
	if (err) {
	  console.error(`An error ocurred: ${String(err)}`);
	  return;
	}
	//
	// create udp client socket
	//
	const udpType = family === 4 ? 'udp4': 'udp6';
	const client = dgram.createSocket(udpType);
	const msgBuffer = Buffer.from(msg, 'utf8');
	client.send(msgBuffer, port, target, (err, bytes) => {
		if (err){
			console.log(`there was an error sending the message: ${String(err)}`);
			return;
		}
		console.log(`Number of bytes sent:${bytes}`);
		client.close();
	});
});