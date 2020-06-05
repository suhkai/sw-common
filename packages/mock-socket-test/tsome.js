'use strict'
const { ServerSocket, Socket } = require('./sockets');
const Network = require('./nw-interface');
const DNS = require('./dns-mock');

const dns = new DNS();
dns.register('node1','192.168.100.18');
dns.register('node2','192.168.100.16');
dns.register('node3','192.168.100.14');
const network = new Network(dns);

// constructor(options, network, fromHost, port)
// make a createConnection wrap the "fromNode"

const socket = new Socket({}, network, 'node1')
const server = new ServerSocket({}, network, 'node2');


server.listen(123, '0.0.0.0', function() {
    console.log('server listening', JSON.stringify(server.address()));
    console.log('client connect attempt');
    socket.connect(123, 'node2');
});


server.on('connection', cs => {
    console.log('Server connection event');
    console.log(`2.connecting: ${cs._connecting}`);
    console.log(`2.destroyed: ${cs._destroyed}`);
    cs.on('connected', ()=>{
        console.log('2.socket connected')
        console.log(`2.socket address:  ${JSON.stringify(cs.address())}`)
        setTimeout(()=>{
            cs.end();
        });
    });
});

server.on('error', err => {
    console.log(`Server error event: ${String(err)}`);
});

socket.on('error', err => {
    console.log(`error Event: ${String(err)}`);
})

socket.on('close', hasErr => {
    console.log(`close Event: ${hasErr}`);
})

socket.on('end', () => {
    console.log(`end Event`);
});

socket.on('finnish', () => {
    console.log(`finnish Event`);
});

/*
server.close((err)=>{
    console.log('server close event callback', err)
});
*/

server.on('close', ()=>{
    console.log('server close event');
});


socket.on('connected', ()=>{
    console.log('1.socket connected')
    console.log(`1.socket address: ${JSON.stringify(socket.address())}`)
});


setTimeout(()=>console.log('ended'), 4000);