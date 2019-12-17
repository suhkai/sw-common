const { tokens } = require('./tokenizer');
const isObject = require('./isObject');

function matchSlice(value, tokenClause){
    if (tokenClause.token === tokens.PREDICATE_REGEXP){
        const regExp = tokenClause.value
        return value.test
    }
}

module.exports = function objectSlice(object, selector, cursor = 0) {
    if (selector.length === cursor){
        return [object];
    }
    const rc = [];
    const instr = selector[cursor];
    switch (instr.token) {
        case tokens.PREDICATE_REGEXP:
        case tokens.PREDICATE:
            if (cursor !== selector.length - 1){ // predicate token (for now) must end on the last element of the path
                break;
            }
            const entries = Object.entries(object);
            for (const [key, value] of entries){
                if (value === 'undefined') {
                    continue; //skip
                }
                if (Array.isArray(value)) {
                    continue; // it can make sense to handle this case, but functionally think first about what it means
                }
                if (isObject(value)){
                    continue; // /a/b/c/[zeaze]/he
                }
                if (instr.token === tokens.PREDICATE_REGEXP){
                    if (instr.value.test(String(value))){ //
                        rc.push(value);
                    }
                }
                if (instr.token === tokens.PREDICAT){
                    if (instr.value === String(value)){
                        rc.push(value);
                    }
                }
            }
            break;
        case tokens.SLASH:
            const rcSub = objectSlice(object, selector, cursor + 1);
            rc.push(...rcSub);
            break;
        case tokens.PATHPART:
            const value = object[instr.value];
            if (value === undefined) {
                break;
            }
            if (Array.isArray(value)) {
                if (cursor === selector.length - 1){ // performance enhancement
                    rc.push(...value);
                    break;
                }
                for (const item of value) {
                    const rcSub = objectSlice(item, selector, cursor + 1);
                    rc.push(...rcSub);
                }
                break;
            }
            if (isObject(value)) {
                const rcSub = objectSlice(value, selector, cursor + 1);
                rc.push(...rcSub);
                break;
            }
            rc.push(value);
            break;
        default:
            throw new TypeError(`selector is an incorrect token ${JSON.stringify(instr)}`);
    }
    return rc;
}