'use strict'
import createWebSocket from './browser-websocket';


export function connectionManager(options, statisticsManager) {
   
    return createConnector => codec => {
        let socket;
        let hooked;
        let state = 'init';//|| reconnecting, closed, open
        const hooks = {
            onData(data) {
                // codec is used here
                // codec, ets
                // notify statistics
            },
            onClose(...args) {
                // notify statistics,
                // should reconnect?
            },
            onError(...args) {
                // notify statistics   
            },
            onOpen(...args) {
                // notify statistics
            }
        };
        // hookit up
        hooked = createConnector(hooks);
        socket = hooked.create();

        codec.assignSend((data, done) => {
            hooked.send(socket, data, err => {
                // do something if error, start reconnect logic
                if (err) { // update statistics, restart reconnect logic
                    done(err);
                    return
                }
                done(); //forward it to codec prolly do more here
            });
        });
        // codec has an optional handle to close the connection
        codec.assignClose((reason, done) => {
            hooked.close(socket, reason, done);
        });

        return {
            isOpen(){
                return socket && hooked.isOpen(socket);
            },
            close(reason, done){
                hooked.close(socket, reason, done);
            },
            state(){
                return state;
            }
        }
    }
}

const connection = connectionManager(/*options, statsManager */)(createWebSocket('ws://10.128.130.18:10105'))(/*codec*/);

//
//connection.getState();
//connection.isOpen();
//connection.close();
//

//codec.onData() -> hook up the codec to the switcher
