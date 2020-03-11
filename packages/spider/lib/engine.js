'use strict';

const { filter } = require('./utils/functionals');
module.exports = function engine(queue, handlers, storage) { // linked list?
    const selectBusy = filter(q => q.state !== 'waiting');
    const selectFree = filter(q => q.state === 'waiting');
    
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
