'use strict';
const net = require('net');

const defer = (fn, ...args) => Promise.resolve().then(() => fn(...args));

const tracer = [];

const socket = net.Socket();
socket.ref();
socket.on('connect', function () {
    console.log('connected')
    //console.log(this);
    /*setTimeout(() => {
        // this.end() emits "finish" event (eventually, not close)
        // this.destroy() emits "close" event (eventually)
        // "on end"
        this.end(); // emits finish event, not "close"
        //this.destroy();
        // sends end -> marks destoyed as true
        // sends close -> no error
    }, 2000);*/
});

socket.on('end', () => {
    console.log(`end event received`);
})

socket.on('close', () => {
    tracer.push('close event start');
    defer(() => tracer.push('defer: from close event'))
    tracer.push('close event end');
})

socket.on('error', err => {
    console.log(`connecting ${socket.connecting}`);
    console.log(`destroyed ${socket.destroyed}`);
    console.log(`error ${String(err)}`);
    tracer.push('error event start');
    defer(() => tracer.push('defer: from error event'))
    tracer.push('error event end');
})

socket.on('finish', () => {
    console.log(`finish event received`);
})

socket.connect(8080,'localhost');
defer(() => tracer.push('defer:connect has been called'))
setTimeout(()=>console.log(tracer), 1000);