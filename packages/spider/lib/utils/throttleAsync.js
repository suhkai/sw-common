'use strict';
const createNotifyer = (fn) => () => fn();

function waitFor() {
    let notify;
    const promise = new Promise(resolve => {
        notify = createNotifyer(resolve);
    });
    return {
        notify,
        promise
    }
}

module.exports = function throttle(count, iterator) {
    let cnt = 0;
    let wait;
    let result;
    let error;

    async function process(fn) {
        while (cnt >= count) {
            if (!wait) {
                wait = waitFor();
            }
            await wait.promise;
        }
        const step = iterator.next();
        if (step.done) {
            return;
        }
        cnt++;
        try {
            result = await fn(step.value);
        } catch (err) {
            error = err;
        }
        cnt--;
        if (wait) {
            wait.notify();
            wait = undefined;
        }
        return [result, error];
    }
};


