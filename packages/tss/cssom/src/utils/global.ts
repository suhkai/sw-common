export default typeof window !== 'undefined' && window instanceof Window ? window :
    typeof self !== 'undefined' && self.setImmediate === setImmediate ? self : (Function('return this;'))(); 