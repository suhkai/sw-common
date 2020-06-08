'use strict';
const net = require('net');
const socket = new net.Socket();



// not firing
socket.on('data', chunk => {
    console.log('1/data received', chunk.toString());
})

// not firing
socket.on('end', function (hadError) {
    console.log('1/end/ event received');
    console.log('1/end/ destroyed=', this.destroyed);
    console.log('1/end/ connecting=', this.connecting);
    /*const rc = socket.write('write after end', err => {
        console.log('1/end write after "hello" data has been sent', rc, hadError, err);
        //{"code":"EPIPE"} This socket has been ended by the other party
    });*/
})
// not firing
socket.on('error', err => {
    console.log('1/error/ error event received', JSON.stringify(err), err.message, String(err));
})
// not firing
socket.on('close', hadError => {
    console.log('1/close/ close event received', JSON.stringify(hadError));
    /*const rc = socket.write('write after close', (err) => {
        console.log('1/close/write write after "hello" data has been sent', rc, hadError, err);
        //{"code":"EPIPE"} This socket has been ended by the other party
    });*/
})
// not firing
socket.on('finish', hadError => {
    console.log('1/finish/ finish event received', JSON.stringify(hadError));
    /*const rc = socket.write('write after finish', err => {
        console.log('1/finish write after "hello" data has been sent', rc, hadError, err);
        //{"code":"ERR_STREAM_WRITE_AFTER_END"} write after end
    });*/
})

setTimeout(() => {
    //socket.destroy();
    socket.end((hadError) => {
        console.log('1/write end sent after 2 sec')
        /*const rc = socket.write('write after end() called', err => {
            console.log('11/end write after "hello" data has been sent', rc, hadError, err);
            //{"code":"ERR_STREAM_WRITE_AFTER_END"} write after end
        });*/
    })
}, 2**31-1)

// not yet connected ?
console.log('connected?', socket.connecting, socket.pending);
const rc = socket.write('hello-tit-for-tat', (err) => {
    console.log('1/write after "hello-tit-for-tat" data has been sent', rc,err);
});

socket.connect(8088, 'localhost', function () {
    console.log('1/connected/ socket this=socket?', this === socket)
    console.log('1/connected/ destoyed=', this.destroyed)
    console.log('1/connected/ connecting=', this.connecting)
    //this.end(()=>console.log('1/connected ending is called'))
    //const rc = this.write(() => {
    //    console.log('1/connected after "hello" data has been sent', rc);
    //});
})