'use strict'

export function createWebSocket(url, options) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let ws;
    let cnt = 0;

    function closeSafe() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            return false;
        }
        if (ws) {
            try {
                ws.onclose = null;
                ws.close();
            }
            catch (e) { /**/ }
        }
        ws = undefined;
        return true;

    }

    return pipe => ({
        create() {
            if (!closeSafe()) {
                return false;
            }
            try {
                let pUrl = url;
                let pOptions = options;
                if (typeof url === 'function') {
                    [pUrl, pOptions] = url(cnt++);
                }
                ws = new WebSocket(pUrl, pOptions);
            }
            catch (err) {
                return [err]
            }
            ws.binaryType = 'arraybuffer';
            ws.onclose = e => {
                pipe.onClose(e.reason, e.wasClean);
            }
            ws.onopen = () => {
                pipe.onReady();
            };
            ws.onerror = () => {
                pipe.onError();
            }
            ws.onmessage = ({ data }) => {
                pipe.onData(data);
            }
            return [undefined, ws];
        },
        close(reason, done) {
            if (!ws) {
                return true;
            }
            let text
            if (typeof reason === 'string' && reason.length) {
                let rawBytes = encoder.encode(reason);
                if (rawBytes.length >= 62) {
                    rawBytes = rawBytes.splice(0, 60);
                }
                text = decoder.decode(rawBytes);
            }
            let err;
            try {
                if (text) {
                    ws.close(1000, text);
                }
                else {
                    ws.close(1000);
                }
            }
            catch (e) {
                err = e;
            }
            finally {
                done && 
                ( 
                    (err && done(err))
                    || 
                    done() 
                );
            }
        },
        send(data, done) {  // metadata has information on remote host, port, other things that are use full depending on wire transfer technology
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                done(`socket not open: readyState=${ws.readyState}`);
                return;
            }
            try {
                ws.send(data);
            }
            catch (err) {
                done(err);
                return;
            }
            done();
        },
        isReady() {
            return ws && ws.readyState === WebSocket.OPEN;
        }
    });
}







