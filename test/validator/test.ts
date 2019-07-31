export { };
import v from '../../src/validator';

describe('test validator', () => {
    it('validate object props', () => {
        //create a validator
        const validator = v.numeric.max(100).min(-5);
        //test this validator
        let [result, error] = validator('4'); 
        //-> [4, null]
        [result, error] = validator(233); 
        //-> [null, TypeError: [233] not smaller then 100]
    });
});