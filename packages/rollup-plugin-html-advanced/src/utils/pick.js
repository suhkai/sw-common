const clone = require('clone');

module.exports = function pick(obj, ...args) {
    const temp = clone(obj);
    const rc = Object.create(null);
    for (const [prop, value] of Object.entries(o)) {
        if (args.includes(prop)) {
            rc[prop] = value;
        }
        continue;
    }
    return rc;
}
