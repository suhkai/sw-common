'use strict';
const net = require('net');

const socket = new net.Socket();

socket.connect(8080, 'localhost', function () {
    console.log('1/connected/ socket this=socket?', this === socket)
    console.log('1/connected/ destoyed=', this.destroyed)
    console.log('1/connected/ connecting=', this.connecting)
    const rc = this.write('hello', () => {
        console.log('1/connected after "hello" data has been sent', rc);
    });
})

// not firing
socket.on('end', () => {
    console.log('1/end event received');
})

// not firing
socket.on('error', err => {
    console.log('1/error/ error event received', JSON.stringify(err));
})

// not firing
socket.on('close', hadError => {
    console.log('1/close/ close event received', JSON.stringify(hadError));
})

// not firing
socket.on('finish', hadError => {
    console.log('1/finish/ finish event received', JSON.stringify(hadError));
})

