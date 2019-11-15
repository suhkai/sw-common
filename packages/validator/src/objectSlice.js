const { tokens } = require('./tokenizer');
const isObject = require('./isObject');

module.exports = function objectSlice(object, selector, cursor = 0) {
    const rc = [];
    const instr = selector[cursor];
    switch (instr.token) {
        case tokens.SLASH:
            break;
        case tokens.PATHPART:
            const value = object[instr.value];
            if (cursor === undefined) {
                break;
            }
            if (Array.isArray(value)) {
                for (const item of value) {
                    const rcSub = objectSlice(item, selector, cursor + 1);
                    rc.push(...rcSub);
                }
            }
            if (isObject(value)) {
                const rcSub = objectSlice(value, selector, cursor + 1);
                rc.push(...rcSub);
            }
            break;
        default:
            throw new TypeError(`selector is an incorrect token ${JSON.stringify(intr)}`);
    }
    return rc;
}