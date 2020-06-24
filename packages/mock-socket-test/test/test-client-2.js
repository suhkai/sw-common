'use strict';
const net = require('net');
const socket = new net.Socket();
const createDefer = require('../src/defer');
const defer = createDefer();


console.log(`socket pending: ${socket.pending}`);

// not firing
socket.on('data', chunk => {
    console.log('1/data received', chunk.toString());
})

// not firing
socket.on('end', function (hadError) {
    console.log('1/end/ event received');
    console.log('1/end/ destroyed=', this.destroyed);
    console.log('1/end/ connecting=', this.connecting);
    console.log('1/end/ pending=', this.pending);
})
// not firing
socket.on('error', err => {
    console.log('1/error/ error event received', JSON.stringify(err), err.message, String(err));
})
// not firing
socket.on('close', hadError => {
    console.log('1/close/ close event received', JSON.stringify(hadError));
})
// not firing
socket.on('finish', hadError => {
    console.log('1/finish/ finish event received', JSON.stringify(hadError));
})


socket.connect(8088, 'localhost', function () {
    console.log('1/connected/ socket this=socket?', this === socket)
    console.log('1/connected/ destroyed=', this.destroyed)
    console.log('1/connected/ connecting=', this.connecting)
    console.log('1/connected/ pending=', this.pending);
    //this.destroy();
    /*'hello', ()=>{
        console.log('1/after end has been called');
    })*/
})

console.log(`1/after socket.connect/socket pending: ${socket.pending}`);