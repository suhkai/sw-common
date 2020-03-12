'use strict';

const { filter } = require('./utils/functionals');
module.exports = function engine(options) { // linked list?

    const cache = options.cache;
    
    hydrate(cache)
    
    let todo;
    out:
    do {
        todo = selectFree(queue);
        const { value: data, done } = todo.next();
        if (done) { // no todo
            if (selectBusy(queue).next().done)
                break out; // nothing to do
            }
        }
        throttle()
        //
        //



    };
