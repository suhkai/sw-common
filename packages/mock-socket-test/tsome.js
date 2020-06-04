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

server.listen(123, function() {
    console.log('server listening');
    socket.connect(123, 'node2');
});

server.on('connection', socket => {
    console.log(`connecting: ${socket._connecting}`);
    console.log(`destroyed: ${socket._destroyed}`);
    socket.on('connected', ()=>{
        console.log('2.socket connected')
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



