
module.exports = class NetworkError extends Error {
	constructor (code, syscall, message, aux) {
		super(message);
		this.code = code;
		this.syscall = syscall;
		this._aux = aux;
	}
   
	toString () {
		return super.toString();
	}
};

/*
 *EPIPE error
 *{
 *    message: {
 *        value: 'This socket has been ended by the other party',
 *        writable: true,
 *        enumerable: false,
 *        configurable: true
 *    },
 *    code: {
 *        value: 'EPIPE',
 *        writable: true,
 *        enumerable: true,
 *        configurable: true
 *    }
 *}
 */

/**
 * if you try to send on a close socket
 *   message: {
 *  value: 'read ECONNRESET',
 *  writable: true,
 *  enumerable: false,
 *  configurable: true
 *},
 *errno: {
 *  value: 'ECONNRESET',
 *  writable: true,
 *  enumerable: true,
 *  configurable: true
 *},
 *code: {
 *  value: 'ECONNRESET',
 *  writable: true,
 *  enumerable: true,
 *  configurable: true
 *},
 *syscall: {
 *  value: 'read',
 *  writable: true,
 *  enumerable: true,
 *  configurable: true
 *}
 *
 *
 */

/*
 *this happens on the counterparty when someone kills(ctrl-c the counter process)
 *connected
 *error event "read ECONNRESET", errno="ECONNRESET", code="ECONNRESET"
 *close true
 *error event "Cannot call write after a stream was destroyed", errno="undefined", code="ERR_STREAM_DESTROYED"
 */
    
/*
 *$ node test-client.js
 *error event received Error: connect ECONNREFUSED 127.0.0.1:8080
 *    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16) {
 *  errno: 'ECONNREFUSED',
 *  code: 'ECONNREFUSED',
 *  syscall: 'connect',
 *  address: '127.0.0.1',
 *  port:
 */
