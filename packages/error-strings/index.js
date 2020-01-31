function createErrorStrings(partial, fn) {
    if (typeof partial === 'string') {
        return function (partialSub) {
            if (typeof partialSub === 'string') {
                return createErrorStrings(partialSub, () => {
                    return `${fn ? fn(): ''}[${partial}]`;
                });
            }
            return `${fn ? fn(): ''}[${partial}]`;
        }
    }
    if (fn === undefined) {
        throw new TypeError('createErrorString was both created with no arguments, must be at least 1');
    }
    return fn();
}

const fn1 = createErrorStrings('amqp');
const fn2 = fn1('close');
const fn3 = fn2('chan-02');
console.log(fn3());
console.log(fn2());

