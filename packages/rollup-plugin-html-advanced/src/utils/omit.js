const clone = require('clone');

module.exports = function omit(obj, ...args) {
    const temp = clone(obj);
    const rc = Object.create(null);
    for (const [prop, value] of Object.entries(o)) {
        if (args.includes(prop)) {
            continue;
        }
        rc[prop] = value;
    }
    return rc;
}