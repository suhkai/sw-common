'use strict';
/*
 *  for later
 * const ServerSocket = require('./server-socket');
 */
const NError = require('./error');


function assertHostPort (host, port) {
	if (host === 'localhost' || host === '127.0.0.1') {
		throw new Error('localhost or 127.0.0.1 not allowed');
	}
	if (typeof port !== 'number' || !isFinite(port)) {
		throw new Error(`port is not a valid number ${port}`);
	}
}

module.exports = class NetInterface {
	constructor (dns) {
		this._dns = dns;
		this._claimedPorts = new Map();
		// listen is as in posix "listen" not event listeners
	}

	nsLookupBy (host) {
		return this._dns.nsLookupBy(host);
	}

	claimPort (port, host, socket) {
		assertHostPort(host, port);
		// get ip of host
		const ips = this._dns.nsLookupBy(host);
		if (!ips.length) {
			return -1; // lookup failed host not registered
		}
		// pick the first
		const ports = this._claimedPorts.get(ips[0]) || new Map();
		this._claimedPorts.set(ips[0], ports);
		if (port === 0) { // chose random port between 16384 and 32768
			port = 16384 + Math.trunc((32768 - 16384) * Math.random());
			for (; ports.has(port);) {
				port = 16384 + Math.trunc((32768 - 16384) * Math.random());
			}
		}
		if (ports.has(port)) { /// in this case listen claimed the port
			return 0; // reserved port
		}
		// console.log(socket instanceof  ServerSocket);
		ports.set(port, socket);
		return port;//claimed port
	}

	releasePort (port, host) {
		assertHostPort(host, port);
		const ips = this._dns.nsLookupBy(host);
		if (!ips.length) {
			return false;
		}
		const ports = this._claimedPorts.get(ips[0]);
		if (!ports) {
			return false;
		}
		if (ports.has(port)) {
			ports.delete(port);
			return true;
		}
		return false;
	}

	getRemoteSocket (port, host) {
		assertHostPort(host, port);
		const ips = this._dns.nsLookupBy(host);
		for (const ip of ips) {
			const ports = this._claimedPorts.get(ip);
			if (!ports) {
				continue;
			}
			if (!ports.has(port)) {
				continue;
			}
			// found it
			const socket = ports.get(port);
			//console.log(socket instanceof  ServerSocket);
			return socket;
		}
		return undefined;
	}
};


