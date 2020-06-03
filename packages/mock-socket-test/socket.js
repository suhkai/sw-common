'use strict';

const EventEmitter = require('events');
const MockServerSocket = require('./server-socket')
const MError = require('./error')
const createDeferer = require('./defer');
const defer = createDeferer();

class MockSocket extends EventEmitter {
    constructor(options, network, fromHost, port) {
        super(options);
        this._options = options;
        this._nw = network;
        this._buffer = Buffer.alloc(16384);
        // some stats
        this._bytesRead = 0;
        this._bytesWritten = 0;
        this._connecting = false;
        this._destroyed = false;
        this._connected = false;
        this._writable = false;
        const ips = network.dns.nsLookupBy(fromHost);
        if (ips.length === 0){
            throw Error(`unknown host "${fromHost}"`);
        }
        this._host = ips[0];
        this._port = port;
        this._cp = undefined; // counterparty socket
    }

    address() {
        return { port: this._port, family: 'IPv4', address: this._host };
    }
    get bufferSize() {
        return this._buffer.byteLength;
    }
    get bytesRead() {
        return this._bytesRead;
    }
    get bytesWritten() {
        return this._bytesWritten;
    }
    get connecting() {
        return this._connecting;
    }
    get destroyed() {
        return this._destroyed;
    }
    // only for outgoing connections
    // incomming connections use "this.accept call" (like posix counterpart)
    connect(port, host, cb) {
        // does the remote host exist and is listened to
        const serverSocket = this._nw.getRemoteSocket(port, host);
        if (!(serverSocket instanceof MockServerSocket)){
            const err = new MError('ENOENT', 'connect', `connect ENOENT ${host}:${port}`);
            defer(()=>{
                this._connecting = false; 
                this._destroyed = true;
                // not close is emitted here defer(()=> this.emit('close', true));
                this.emit('error', err);
            });
            return;
        }
        //
        this._connecting = true;
        if (cb){
            this.once('connect',cb);
        }
        // creates the counterpart of this channel
        // the callback should absoluutly be a deferred call
        // "syn" is always a method on a server socket
        // reserve port on this socket
        // 1. claim local port (randomly chosen).
        this._port = this._nw.claimPort(0, this._fromHost, this);
        serverSocket.syn(this, function synack(err, socket) {
            // from here on its all sync
            if (err){
                const err = new MError('ECONNREFUSED', 'ECONNREFUSED', `connect ECONNREFUSED ${host}:${port}`);
                defer(()=>{
                    this._connecting = false; 
                    this._destroyed = true;
                    // not close is emitted here defer(()=> this.emit('close', true));
                    this.emit('error', err);
                });
                return;
            }
            this._remoteHost = socket._host;
            this._remotePort = socket._port;
            this._cp = remoteSocket;
            remoteSocket.ack(); // will emit "connect"
        });
        return this;
    }
    // fully configured
    // just emit connected "connected"
    ack(){
       // only need to set the remote host etc
       this._connecting = false;
       this._connected = true;
       this.emit('connected');
    }
  
    destroy(error) {
        if (!this._destroyed){
            this._destroyed = true;
        }
        // close immediatly  
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

    _accept(){
        
    }
    

}
