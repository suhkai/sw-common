'use strict';

const EventEmitter = require('events');
const MError = require('./error');
const MockSocket = require('./socket');
const createDefer = require('./defer');

const defer = createDefer();


class MockServerSocket extends EventEmitter {
    constructor(options, network) {
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
        this._listening = false;
        /*const ips = network.dns.nsLookupBy(fromHost);
        if (ips.length === 0) {
            throw Error(`unknown host "${fromHost}"`);
        }
        this._host = ips[0];*/
        this._cp = undefined; // counterparty socket
    }

    address() {
        return { port: this._port, family: 'IPv4', address: this._fromHost };
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
        //`this._port = this._nw.claimPort(0, this._fromHost);
        // does the remote host exist and is listened to
        //this._nw.dns.

    }

    destroy(error) {

    }

    syn(remoteSocket, fn) {
        //(options, network, fromHost) {
        if (!this._listening) {
            // send back error
            defer(fn, true); // send back an true in the error field
            return;
        }
        //   constructor(options, network, fromHost) {
        const socket = new MockSocket({}, this._nw, this._host, this._port);
        // sync_ack, send socket back
        // from here on its all sync
        socket._remoteHost = remoteSocket._host;
        socket._remotePort = remoteSocket._port;
        socket._connecting = true; // a bit useless in this context but lets set it
        socket.cp = remoteSocket;
        defer(fn, undefined, socket); // sync
        return;
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

    _accept() {

    }


}
