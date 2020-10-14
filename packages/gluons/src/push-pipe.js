'use strict'
import createWebSocket from './browser-websocket';


export function pushPipe(source, ...transforms) {

    // 
    // hook up the source
    // if the source ans a reponse/reply it should be on the source
    //
    const hooks = {}
    const preparedSource = source(hooks);
    const final = {}
    const statistics = Array.from(transforms.length+1,()=> ({err:0,ok:0}));

    function createProxyDone(i){
        function proxyDone(err, data){
            if (err){
                statistics[i].err++;
                // collect statistics for slot "i"
                //  check if there is a response on transforms[i-1],
                //  if not check if there is a response on transform[i-1], etc
                //  if no responses found, check response on source object
                //  if there is no response on source do nothing
                //  call the onError handler
                return
            }
            //advance to next pipeline
            statistics[i].ok++;
            const transform = transforms[i+1];
            if (transform){
                transform.onData(data, createProxyDone(i+1));
            }
            else {
                // call finalOndata
                final.onData(data);
            }
        }
    }
    
    hooks.onClose = function (err, reason) { // move up stream
    };
    hooks.onError = function (err) { // move up stream
    };
    hooks.onData = function (data) { // move up stream
        if (transforms.length){
            transforms[0].onData(data, createProxyDone(0));
        }
        else {
            final.onData(data);
        }
    };
    hooks.onReady = function () { // when sockt is ready to streap
    };
    return function (handlers) {
        // copy handlers to final; object
    }
}
