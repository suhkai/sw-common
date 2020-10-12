'use strict'

export function createWebSocket(url, options) {
    return (hooks) => {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        return {
            create() {
                let ws;
                try {
                    ws = new WebSocket(url, options);
                }
                catch (err) {
                    return [err]
                }
                ws.binaryType = 'arraybuffer';
                ws.onclose = e => {
                    hooks.onClose(e.reason, e.wasClean);
                }
                ws.onopen = () => {
                    hooks.onOpen();
                };
                ws.onerror = () => hooks.onError();
                ws.onmessage = ({ data }) => hooks.onData(data);
                return [undefined, ws];
            },
            close(ws, reason, done) {
                let text
                if (typeof reason === 'string' && reason.length) {
                    let rawBytes = encoder.encode(reason);
                    if (rawBytes.length >= 62) {
                        rawBytes = rawBytes.splice(0, 60);
                    }
                    text = decoder.decode(rawBytes);
                }
                try {
                    if (text) {
                        ws.close(1000, text);
                    }
                    else {
                        ws.close(1000);
                    }
                }
                catch (err) {
                    done && done(err);
                    return;
                }
                done && done();
            },
            /*reconnectStrategy(ws, info, transmissionsStats){ // return time delay, if not fixed delay of 500ms
    
            },*/
            send(ws, data, done) {  // metadata has information on remote host, port, other things that are use full depending on wire transfer technology
                if (ws.readyState !== WebSocket.OPEN) {
                    done && done(`websocket in in correct state ${ws.readyState}`);
                    return;
                }
                ws.send(data);
                done && done(); // don't defer it for this socket
            },
            isOpen(ws){
                return ws && ws.readyState === WebSocket.OPEN;
            }
        }
    }
}





