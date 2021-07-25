const dgram = require('dgram');

const WOULD_YOU_LIKE_ME_TO_DROP_BUFFERS = false; // TOGGLE THIS

const PORT = 41234;
const GRAMS = 1000;
const FILL = '##################################################'

function sendgrams() {
    let pos = 0;
    const socket = dgram.createSocket('udp4');
    function funkytown() {
        if (pos >= GRAMS) {
            socket.close((e) => {
                if (e) {
                    console.log(e);
                }
                console.log('Closed.');
            });
            return;
        }
        socket.send(`${pos++} ${FILL}${FILL}${FILL}${FILL}${FILL}${FILL}${FILL}`, PORT, (e) => {
            if (e) {
                console.log(e);
            }
            if (WOULD_YOU_LIKE_ME_TO_DROP_BUFFERS) {
                funkytown();
            } else {
                setTimeout(funkytown, 0);
            }
        });
    }
    funkytown();
}

sendgrams();