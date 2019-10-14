module.exports = function EventTarget() {
    if (this instanceof EventTarget) {
        return EventTarget();
    }
    const map = new Map();
    return Object.freeze({
        addEventListener(name, fn) {
            const found = map.get(name) || new Set();
            map.set(name, found);
            found.add(fn);
        },
        dispatchEvent(name, ...args) {
            const found = map.get(name);
            if (found) {
                for (const fn of found) {
                    fn(...args);
                }
            }
        },
        removeEventListener(name, fn) {
            const found = map.get(name);
            if (found) {
                found.delete(fn);
            }
        },
        removeAllListeners(eventName) {
            return map.delete(eventName);
        },
        eventNames() {
            return Array.from(map.keys());
        }
    });
}