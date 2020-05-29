var net = require('net');
const { MessageChannel } = require('worker_threads'); // nodev10
const EventEmitter = require('events');

function createNodeErr(code, syscall, message, aux) {
    const err = new Error();
    Object.defineProperties(err, {
        code: {
            value: code,
            writeble: false
        },
        err: {
            value: code,
            writeble: false
        },
        syscall: {
            value: syscall,
            writeble: false
        },
        message: {
            value: message || 'no message text provided',
            writable: false,
            enumerable: false,
            configurable: false
        }
    })
    for (const [key, value] of Object.entries(aux)) {
        Object.defineProperty(err, key, {
            value,
            writable: false
        });
    }
    return err;
}

function normalizeHost(host) {
    if (host === '0.0.0.0' || host === '127.0.0.1') {
        host = 'localhost'
    }
    return host;
}

function safe(fn, ...args) {
    try {
        fn.apply(this, args);
    }
    catch (err) {

    }
}

function defer(fn) {
    return (...args) => process.nextTick(fn, ...args)
}

const deferSafe = defer(safe);


const netInterface = (function () {
    // listinging on host/port
    /*
    {
        host1: {
            //port1
            //port2
        },
        host2: {
            //port1
            //port2
        }
    }
    }*/

    const nwm = {};

    return {
        listen({ port, host = 'localhost' }) {
            host = normalizeHost(host);
            if (!nwm[host]) {
                nwm[host] = {};
            }
            if (nwm[host][port]) { // already listening
                const err = createNodeErr('EADDRINUSE', 'listen', `EADDRINUSE: address already in use ${host}:${port}`, { address: host, port })
                return [err];
            }
            nwm[host][port] = this; //this is ServerSocket
        },
        connect({ port, host = 'localhost' }, fromHost = 'localhost') {
            host = normalizeHost(host);
            if (!(nwm[host] && nwm[host][port] && (nwm[host][port] instanceof ServerSocket))) {
                const err = createNodeErr('ECONNREFUSED', 'connect', `connect ECONNREFUSED ${host}:${port}`, { address: host, port })
                return [err];
            }
            // choose random end points for the client
            nwm[fromHost] = nwm[fromHost] || 'localhost';
            let fromPort;
            for (; ;) {
                fromPort = Math.round(Math.random() * 10000) + 16000; //between 16000 and 26000
                if (nwm[fromHost][fromPort]) {
                    continue;
                }
                break;
            }
            const { port1, port2 } = new MessageChannel();
            nwm[fromHost][fromPort] = port2;
            nwm[host][port].create(port1, fromHost, fromPort) // will induce socket creation on the server isde
            return [undefined, port2, fromHost, fromPort];
        },
        destroy(fromPort, fromHost, toPort, toHost) {
            // find toHost toPort
            let host = normalizeHost(toHost);
            fromHost = normalizeHost(fromHost);
            let port = toPort;
            if (nwm[host] && nwm[host][port] && (nwm[host][port] instanceof ServerSocket)) {
                // server does not exist
                nwm[host][port].destroy(fromHost, fromPort);
            }
            port = fromPort;
            if (nwm[fromHost] && nwm[fromHost][fromPort]) {
                nwm[fromHost][fromPort].close(); // close the port
                nwm[fromHost][fromPort] = undefined;
                delete nwm[fromHost][fromPort];
            }
        }
    }
})();

// create socket pair and hand one to the listen and other to the client

function fromHost(fromHost = 'localhost') {
    return function createConnection(options = {}, cb) {
        Object.assign(options, { host: 'localhost ' });
        const mockSocket = new MockSocket(options);
        if (cb) {
            mockSocket.on('connect', cb); // register
        }
        const [err, port2, fromHost, fromPort] = netInterface.connect(options, fromHost);
        if (err) {
            deferSafe(() => mockSocket.emit('error', err));
            return mockSocket;
        }
        Object.defineProperties(mockSocket, {
            _remotePort: {
                value: options.port,
                writable: false,
                enumerable: false
            },
            _remoteHost: {
                value: options.host,
                writeble: false,
                enumerable: false
            },
            _port: {
                value: fromPort,
                writable: false,
                enumerable: false
            },
            _host: {
                value: fromHost,
                writable: false,
                enumerable: false
            },
            /**
             * write(data, encoding, cb) {
        let _cb;
        let _encoding;
        if (arguments.length === 3) {
            _cb = cb;
            _encoding = encoding;
        }
        else if (arguments.length === 2) {
            if (typeof arguments[1] === 'function') {
                _cb = arguments[1];
            }
            if (typeof arguments[1] === 'string') {
                _encoding = arguments[1];
            }
        }
        if (arguments.length === 0) {
            // emit an error
            this.error()
        }
    }
             * 
             */
            write: {
                value: (data) => {
                    // extend this with all possibilities of write
                    port2.postMessage(data);
                }
            }
        });
        // process messages from port2
        port2.onmessage = function (data) { 
            // process data comming from counterparty
            // special codes for closing sockets and stuff

        }


    }
}

class MockSocket extends EventEmitter {
    constructor(options) {
        super(options);
        this._options = options;
    }
    address() {

    }
    get bufferSize() {

    }
    get bytesRead() {

    }
    get bytesWritten() {

    }
    connect() {
        // path, connectListener
        // port, host, connectListener
        // options, connectListener
    }
    get connecting() {

    }
    destroy(error) {

    }
    get destroyed() {

    }
    end(data, encoding, callback) {
        // data
        // data callback
        // data encoding
        // data encoding callback

    }
    get destroyed() {

    }
    get localPort() {

    }
    pause(error) {

    }
    get pending() {

    }
    ref() {

    }
    get remoteAddress() {

    }
    get remoteFamily() {

    }
    get remotePort() {

    }
    setEncoding(encoding) {

    }
    setKeepAlive(enable, initialDelay) {
        // enable
        // initialDelay
        // enable, initialDelay
    }
    setNoDelay(noDelay) {
        // noDelay
        // initialDelay
        // enable, initialDelay
    }
    setTimeout(timeout, callback) {
        // timeout
        // timeout, callback
    }
    unref() {

    }

}



var client = new net.createConnection({ port: 8080 }, function () {
    //client.connect(1337, '127.0.0.1', function() {
    console.log('Connected');
    let timeid;
    // this.write('Hello, server! Love, Client.');

    this.on('data', function (data) {
        console.log('Received: ' + data);
        // setTimeout(()=>client.destroy(), 10000); // kill client after server's response
    });

    this.on('close', function (err) {
        clearInterval(timeid);
        console.log('close', err);
    });

    this.on('end', function () {
        clearInterval(timeid);
        console.log('End');
    });

    this.on('error', function (err) {
        clearInterval(timeid);
        console.log('there was an error EVENT')
        //console.log('Connection Err', err);
    });

    this.on('lookup', () => {
        console.log('lookup');
    });

    this.on('ready', () => {
        console.log('ready')
    })

    this.on('timeout', () => {
        console.log('timeout')
    })
    timeid = setInterval(async () => {
        try {
            this.write('' + Math.random(), () => console.log('sent'));
        } catch (err) {
            console.log('there was an error'); // this never happens
            //console.log(err);
        }
    }, 1000);
})
