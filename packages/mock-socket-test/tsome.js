const ServerSocket = require('./server-socket');
const Network = require('./nw-interface');
const Socket = require('./socket');
const DNS = require('./dns-mock');

const dns = new DNS();

const network = new Network(dns);
//    constructor(options, network, fromHost, port) {
const socket = new Socket({}, network, 'localhost')
const server = new ServerSocket({}, network);

