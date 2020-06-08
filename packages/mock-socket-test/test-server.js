const net = require('net');

const createDeferSeq = require('./defer-sequence');

const sched = createDeferSeq();

const server = net.createServer(function (s) {
    console.log('2/connected event received', s.address());
   
    // just close the client socket after 2 sec of connecting
    /*setTimeout(()=>{
        s.end(()=>{
            console.log('2/socket.end called (after)')
        });
    }, 2000);*/
    
    //s.pipe(s);
    s.on('end', () => {
        console.log('2/end event received')
        console.log(`2/end destroyed flag:${s.destroyed}`); // true when it is end
    });

    s.on('close', err => {
        console.log('2/close event received', err)
        console.log(`2/close destroyed flag:${s.destroyed}`); // true when it is end
    });

    s.on('finish', err => {
        console.log('2/finish event received', err)
        // lets strip the "error" event handler from the socket first
        // s.removeAllListeners('error'); , if this is done before there s.write, a global EPIPE error is emitted
        //s.write('some test'); // -> still error event will be called after the close
    });

    s.on('error', err => {
        console.log(`2/error event  received: "${JSON.stringify(err)}"`)
    });

    /*s.on('data', data => {
        console.log('2/data/ received', data)
        
    })*/
    // if you write, make sure the "client" counterparty has a on("data") event otherwise "end" and "close" will not fire properly
    //s.write('Echo server\r\n');
});

server.listen(8088, '0.0.0.0', () => {
    console.log('listening', this === server);
});

server.on('error', err0 => {
    console.log(`server error ${String(err0)}`);
});

server.on('close', err0 => {
    console.log(`server close ${String(err0)}`);
});
