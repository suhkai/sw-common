'use strict';
const createNotifyer = (fn, o) => () => {
    fn();
    o.resolved = true;
};

function waitFor() {
    let notify;
    let used = { resolved: false };
    const promise = new Promise(resolve => {
        notify = createNotifyer(resolve, used);
    });
    return {
        notify,
        promise,
        used
    }
}

module.exports = function throttle(count = 1, iterator) {
    let cnt = 0;
    let wait;

    if (count <= 0 || typeof count !== 'number') {
        count = 1;
    }

    return async function process(fn) {
        while (true) {
            if (!wait || wait.used.resolved) {
                wait = waitFor();
            }
            if (cnt >= count) {
                await wait.promise;
                continue;
            }
            cnt++;
            const step = iterator.next();
            if (step.done) {
                cnt--;
                return []; // nothing left to be done
            }
            let error;
            let result;
            try {
                result = await fn(step.value);
            } catch (err) {
                error = err;
            }
            cnt--;
            wait.notify();
            return [result, error];
        }
    }
};


