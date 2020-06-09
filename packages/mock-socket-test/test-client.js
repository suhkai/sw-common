'use strict';
const net = require('net');
const socket = new net.Socket();
const createDefer = require('./defer');

const defer = createDefer();



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
}, 2 ** 31 - 1)




socket.connect(8088, 'localhost', function () {
    console.log('1/connected/ socket this=socket?', this === socket)
    console.log('1/connected/ destoyed=', this.destroyed)
    console.log('1/connected/ connecting=', this.connecting)
    //this.end(()=>console.log('1/connected ending is called'))
    //const rc = this.write(() => {
    //    console.log('1/connected after "hello" data has been sent', rc);
    //});
    // whne you are connected start sending radnom data and see how messages are called
    function sendRandom() {
        defer(() => {
            let count = 1000 + Math.trunc(Math.random() * 1000);
            const buffer = Buffer.alloc(count);
            for (let i = 0; i < count; i++) {
                buffer[i] = Math.trunc(Math.random() * 255);
            }
            socket.write(buffer, err => {
                console.log(`1/written data of length ${count}, with error=${JSON.stringify(err)}`);
                sendRandom(); // kick off next send
            });
        });
    }
    sendRandom();
})