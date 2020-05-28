/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
server, but for some reason omit a client connecting to it.  I added an 
example at the bottom.
Save the following server in example.js:
*/

var net = require('net');

var server = net.createServer(function(s) {
    let cnt = 0;
    s.write('Echo server\r\n');
    //s.pipe(s);
    s.on('end',()=>{
        console.log('end')
    })
    s.on('close',err=>{
        console.log('close',err)
    })
    s.on('error',err=>{
        console.log('error',err)
    })

    s.on('data',data=>{
        cnt++;
        console.log('data',data)
        s.write(data);
        if (cnt > 10){
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

server.listen(8080, '0.0.0.0');