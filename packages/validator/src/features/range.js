
features.set('range', {
    factory: 1,
    name: 'range',
    fn: function createRange(a, b) {
        return function checkRange(data) {
            if (data >= a && data <= b) {
                return [data, null];
            }
            return [null, `value out of bounds`];
        };
    }
});