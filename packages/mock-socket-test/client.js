var net = require('net');

var client = new net.createConnection({ port: 8080 }, function () {
    //client.connect(1337, '127.0.0.1', function() {
    console.log('Connected');
    let timeid;
    // this.write('Hello, server! Love, Client.');

    this.on('data', function (data) {
        console.log('Received: ' + data);
        // setTimeout(()=>client.destroy(), 10000); // kill client after server's response
    });

    this.on('close', function (err) {
        clearInterval(timeid);
        console.log('close',err);
    });

    this.on('end', function () {
        clearInterval(timeid);
        console.log('End');
    });

    this.on('error', function (err) {
        clearInterval(timeid);
        console.log('Connection Err', err);
    });

    this.on('lookup', () => {
        console.log('lookup');
    });

    this.on('ready', () => {
        console.log('ready')
    })

    this.on('timeout', () => {
        console.log('timeout')
    })

    timeid = setInterval(() => this.write('Hello, server! Love, Client.'), 1000)
});
/*
client.on('data', function(data) {
	console.log('Received: ' + data);
	setTimeout(()=>client.destroy(), 10000); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
*/