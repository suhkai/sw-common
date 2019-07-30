export { };
import v from '../../src/validator';

describe('test validator', () => {
    it('validate object props', () => {
        const validator = v.obj({
            a: v.number.integer.max(100).min(-5).optional.done(),
            b: v.string.maxLength(4).minLenght(2).done()
        }).sealed.done();
        console.log(`validator baked: ${typeof validator}`);
    });
});