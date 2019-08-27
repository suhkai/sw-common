'use strict';

export default function(instance: any, stopAtPrototype = 'Object'): void {
    function bindRecursive (obj: Object): void {
        const proto = Object.getPrototypeOf(obj);
        if (proto.constructor.name === stopAtPrototype) {
            return;
        }
        Object.getOwnPropertyNames(proto).forEach(prop => {
            if (typeof proto[prop] === 'function' && prop !== 'constructor') {
                if (!instance.hasOwnProperty(prop)) {
                    instance[prop] = proto[prop].bind(instance);
                }
            }
        });
        return bindRecursive(proto);
    }
    bindRecursive(instance);
}
