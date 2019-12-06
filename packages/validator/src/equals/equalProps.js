const equalArray = require('./equalArray');

module.exports = function equalprops(a, b, selector, equal) {
    const aS = selector(a);
    const bS = selector(b);
    if (aS.length !== bS.length) {
        return false;
    }
    if (!equalArray(aS, bS, equal)) {
        return false;
    }
    for (const s of aS) {
        const v1 = a[s];
        const v2 = b[s];
        if (!equal(v1, v2)) {
            return false;
        }
    }
    return true;
};
