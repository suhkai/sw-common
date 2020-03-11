function convertToIterator(data){
    if (data === undefined) return [][Symbol.iterator]();
    if (Array.isArray(data)) {
        san = data[Symbol.iterator]();
    }
    if (typeof data.next === 'function') {
        san = data;
    }
    if (san === undefined) {
        san = [data][Symbol.iterator]();
    }
    return san;
}

module.exports.filter = function filter(fn) {
    return function* (data) {
        const san = convertToIterator(data);
        for (const itm of san) {
            if (fn(itm)) {
                yield itm;
            }
        }
    };
};


module.exports.map = function map(fn) {
    return function* (data) {
        const san = convertToIterator(data);
        for (const itm of san) {
            yield fn(itm);
        }
    };
};


module.exports.serial = function serial(...fns){
    const nonFun = fns.find(f => typeof f !== 'function');
    if (nonFun !== undefined){
        throw new TypeError(`all arguments to "serial" must be functions`);
    }
    return function* (data){
        const san = convertToIterator(data);
        const cfns = fns.slice();
        let composite = cfns.shift()(san);
        while (cfns.length){
            composite = cfns.shift()(composite);
        }
        for (const itm of composite) {
            yield itm;
        }
    }
}

