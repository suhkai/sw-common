require('dgram')
.createSocket('udp4')
.on('message', (msg, rinfo) => {
    msg = `${msg}`.split(' ')[0];
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
})
.bind(41234);