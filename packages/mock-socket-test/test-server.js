var net = require('net');

var server = net.createServer(function (s) {
    let cnt = 0;
    s.write('Echo server\r\n');
    //s.pipe(s);
    s.on('end', () => {
        console.log('end')
    })
    s.on('close', err => {
        console.log('close', err)
    })
    s.on('error', err => {
        console.log('error', err)
    })

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
});

server.listen(8080, '0.0.0.0', function () {
    console.log('listening', this === server)
});

server.on('error', errO => {
    const port = 8080;
    const host ='0.0.0.0';
    const err = new Error();
    Object.defineProperties(err,{
        code:{
           value: 'EADDRINUSE',
           writeble: false
        },
        err:{
            value: 'EADDRINUSE',
           writeble: false
        },
        syscall: {
            value: 'listen',
            writeble: false
        },
        address: {
            value: host,
            writeable: false
        },
        message: {
            value: 'listen EADDRINUSE: address already in use 0.0.0.0:8080',
            writable: false
        }
    });
    console.log(err);
        //console.log(`${err.code}, ${err.errno}, ${err.syscall}, ${err.address}, ${err.message}, ${String(err)}`);
      //  console.log(Object.getPrototypeOf(err).constructor.name)
    //EADDRINUSE, 
    //EADDRINUSE, 
    //listen, 
    //0.0.0.0, 
    //listen EADDRINUSE: address already in use 0.0.0.0:8080, 
    //Error: listen EADDRINUSE: address already in use 0.0.0.0:8080
})

