const setHeader = require('./setHeader');
const omitInPlaceIgnoreCase = require('../omitIgnoreCase');
const getResponseFromRequest = require('./getResponseFromRequest');
const writeToStreamAndEnd = require('../io/writeToStreamAndEnd');
const bleedReadable = require('../io/bleedReadable');
const stripCtrlCodes = require('../stripCtrlCodes');
const isHttpSuccess = require('./isHttpSuccess');

module.exports = function createHttpClient(createHttpRequest, logger, config) {
    config.proxy = config.proxy || {};
    const { host, port, proxy: { host: proxyHost, port: proxyPort } } = config;

    // path includes querystring!!
    return async function send(method, path, originHeaders, originBody = '') {
        const headers = Object.assign({}, originHeaders);
        if (originBody.length > 0) {
            setHeader(headers); // contenttype
            setHeader(headers, 'Content-Length', Buffer.byteLength(originBody))
        }
        else {
            omitInPlaceIgnoreCase(headers, 'Content-Type', 'Content-Length');
        }
        
        const clientRequest = createHttpRequest(host, port, method, encodeURI(path), headers, proxyHost, proxyPort);
        const captureRequestPromise = getResponseFromRequest(clientRequest);
        const [msg, err1] = await writeToStreamAndEnd(clientRequest, originBody);
        if (err1 || msg !== true) {
            const errMsg = stripCtrlCodes(`[http-req][writing to stream failed][${String(err1)}]`);
            logger.error(errMsg);
            return [undefined, new Error(errMsg)];
        }
        const [incMsg, err2] = await captureRequestPromise;
        if (err2) {
            const errMsg = stripCtrlCodes(`[http-req][error when getting response from host][${String(err2)}]`);
            logger.error(errMsg);
            return [undefined, new Error(errMsg)];
        }
        // for bigger stuff, return stream directly
        const [responseBody, err3] = await bleedReadable(incMsg);
        if (err3) {
            const errMsg = stripCtrlCodes(`[http-req][send06][${String(err3)}]`);
            logger.error(errMsg);
            return [undefined, new Error(errMsg)];
        }
        if (!isHttpSuccess(incMsg.statusCode)) {
            const { statusCode, statusMessage } = incMsg;
            const errMsg = stripCtrlCodes(`[http-req][send07][status:${statusCode}][${method}][headers][${JSON.stringify(headers)}][${encodeURI(path)}][${host}][response][${responseBody}][request][${originBody}]`);
            logger.warn(errMsg);
            return [undefined, new Error(errMsg)];
        }
        return [responseBody, undefined];
    }
}


