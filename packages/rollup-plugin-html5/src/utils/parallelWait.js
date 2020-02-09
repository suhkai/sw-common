const eventTarget = require('./EventTarget');
const isObject = o => o !== null && typeof o === 'object' && !(o instanceof Array);

module.exports = function (promises) {
    return new Promise(resolve => {

        const isObj = isObject(promises);
        const rc = isObj ? {
            resolved: {},
            rejected: {}
        } : {
            resolved: [],
            rejected: []
        }
        const resolved = rc.resolved;
        const rejected = rc.rejected;
        if (!promises || promises.length === 0 || Object.keys(promises).length === 0) {
            resolve(rc);
            return;
        }
        const length = o => isObject(o) ? Object.keys(o).length: o.length;
        const isReady = () => length(resolved) + length(rejected) >= length(promises);

        const et = eventTarget();
        et.addEventListener('ok', r => {
            isObj ? resolved[r.name] = r.value: resolved.push(r);
            if (isReady()) {
                resolve(rc);
            }
        });
        et.addEventListener('not-ok', (...args) => {
            isObj ? rejected[r.name] = r.value: rejected.push(r);
            if (isReady()) {
                resolve(rc);
            }
        });

        const ack = (event, name) => {
            return data => {
                et.dispatchEvent(event, isObj ? { name, value: data } : data)
            }
        };

        for (const [name, value] of Object.entries(promises)) {
            value
            .then(ack('ok',name))
            .catch(ack('not-ok',name));
        }
    });
}