'use strict';

module.exports = function createDefer(delay = 0) {
    if (delay===0){
        return function defer(fn,...args) {
            Promise.resolve().then(()=> {
                try {
                    fn(...args);
                }
                catch(err){
                    
                }
            });
        }
    }
    return function defer(fn, ...args) {
        setTimeout(() => fn(...args), typeof delay === 'function' ? delay() : deflay);
    };
};