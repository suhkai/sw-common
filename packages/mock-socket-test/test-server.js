var net = require('net');

var server = net.createServer(function (s) {
    let cnt = 0;
    console.log('connected',s.address());
    s.write('Echo server\r\n');
    
    //s.pipe(s);
    s.on('end', () => {
        console.log('end event received')
        console.log(`destroyed flag:${s.destroyed}`); // true when it is end
        //s.write('some test'); // -> this will fire an error event before close event
    });

    s.on('close', err => {
        console.log('close event received', err)
        console.log(`destroyed flag:${s.destroyed}`); // true when it is end
        // lets strip the "error" event handler from the socket first
        // s.removeAllListeners('error'); , if this is done before there s.write, a global EPIPE error is emitted
        //s.write('some test'); // -> still error event will be called after the close
    });

    s.on('finish', err => {
        console.log('finish event received', err)
        // lets strip the "error" event handler from the socket first
        // s.removeAllListeners('error'); , if this is done before there s.write, a global EPIPE error is emitted
        //s.write('some test'); // -> still error event will be called after the close
    });

    s.on('error', err => {
        console.log(`error event "${err.message}", errno="${err.errno}", code="${err.code}"`)
    });

    s.on('data', data => {
        cnt++;
        console.log('data', data)
        s.write(data);
        if (cnt > 10) {
            console.log('closing after 10x')
            s.destroy();
        }
    })

    s.on('lookup', () => {
        console.log('lookup');
    });

    s.on('ready', () => {
        console.log('ready')
    })

    s.on('timeout', () => {
        console.log('timeout')
    })
    //setTimeout(()=>s.end(),500);
});

server.listen(8080, '0.0.0.0', function () {
    console.log('listening', this === server)
});

server.on('error', errO => {
    console.log(`server error ${String(err0)}`);
});

//console.log(Object.getOwnPropertyDescriptors(server));
/*
server.connect(80, 'www.jacob-bogers.com', () => {
    console.log('ok connect works')
});
*/

