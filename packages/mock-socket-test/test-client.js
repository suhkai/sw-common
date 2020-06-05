'use strict';
const net = require('net');

const createDefer = require('./defer');
const defer = createDefer();

const tracer = [];





const socket = net.createConnection(8080, 'localhost', function () {
    console.log('1.connected', this === socket)
    console.log('1.destoyed', this.destroyed)
    console.log('1.connecting', this.connecting)
    const rc = this.write('hello',()=>{
        console.log('1. "hello" has been sent');
    });
    console.log('1.return code from socket.write is', rc);
   // socket.end();
});

//socket.removeAllListeners();

console.log(socket.eventNames());

socket.on('end', () => {
    console.log(`1. end event received`);
    console.log('trying to write something to the stream')
    //socket.write(new Uint16Array(24)); // lets save some weird object
})

socket.on('close', () => {
    tracer.push('close event start');
    //defer(() => tracer.push('defer: from close event'))
    tracer.push('close event end');
})

socket.on('error', err => {
    console.log('error event received')
    console.log(`   connecting ${socket.connecting}`);
    console.log(`   destroyed ${socket.destroyed}`);
    console.log(`   error=${JSON.stringify(err)}`);
    tracer.push('   error event start');
    //defer(() => tracer.push('defer: from error event'))
    tracer.push('   error event end');
})

socket.on('finish', () => {
    console.log(`finish event received`);
})

//socket.connect(8080);
//defer(() => tracer.push('defer:connect has been called'))
/*setTimeout(()=>{
    console.log(tracer);
}, 13000);*/

socket.on('data', chunk =>{
    console.log(chunk);
});

socket.setEncoding('utf8')

console.log(socket.eventNames());