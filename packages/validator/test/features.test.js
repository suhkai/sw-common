const chaiAsPromised = require('chai-as-promised');
const { describe, it, before, after } = require('mocha');
const chai = require('chai');
chai.should();
chai.use(chaiAsPromised);
const { expect } = chai;

const convertToNumber = require('../src/convert2Number');
const convertToBoolean = require('../src/convert2Boolean');
const isStringArray = require('../src/isStringArray');
const isInt = require('../src/isInteger');
const isObject = require('../src/isObject');
const createStringLengthRangeCheck = require('../src/createStringLengthRangeCheck');
const createRangeCheck = require('../src/createRangeCheck');
const isBooleanArray = require('../src/isBooleanArray');
const isNumberArray = require('../src/isNumbersArray');
const equals = require('../src/equals');

const { V, addFeature, removeFeature } = require('../src/proxy');

describe('features tests', function () {
    describe('string', () => {
        it('type check with implicit length check', () => {
            const checker = V.string();
            const [r1, err1] = checker('hello world');
            expect([r1, err1]).to.deep.equal(['hello world', null]);
        });
        it('type check with explicit length', () => {
            const checker = V.string(0, 10);
            const [r1, err1] = checker('123456789A'); // 10 chars
            expect([r1, err1]).to.deep.equal(['123456789A', null])
            const [r2, err2] = checker('123456789ABCF'); // 15 chars, should through error
            expect([r2, err2]).to.deep.equal([null, 'string of length:13 is not between 0 and 10 inclusive']);
            const [r3, err3] = checker(123456); // 15 chars, should through error
            expect([r3, err3]).to.deep.equal([null, 'value type is not of type string: number']);
        });
    });
    describe('number/integer', () => {
        it('number/integer faults', () => {
            const checker = V.number();
            const [r1, err1] = checker('hello world');
            expect([r1, err1]).to.deep.equal([null, 'hello world is not a number']);
            const checker2 = V.integer();
            const [r2, err2] = checker2(1.2);
            expect([r2, err2]).to.deep.equal([null, '1.2 is not an integer']);
        });
        it('number between a range', () => {
            const checker = V.number(-56, 99);
            const [r1, err1] = checker(-56.01);
            expect([r1, err1]).to.deep.equal([null, '-56.01 is not between -56 and 99 inclusive']);
            const [r2, err2] = checker(89);
            expect([r2, err2]).to.deep.equal([89, null]);
        });
        it('integer between a range', () => {
            const checker = V.integer(-56, 99);
            const [r1, err1] = checker(-56.01);
            expect([r1, err1]).to.deep.equal([null, '-56.01 is not an integer']);
            const [r2, err2] = checker(14);
            expect([r2, err2]).to.deep.equal([14, null]);
        });
        it('wrong range specification', () => {
            const checker = () => {
                V.integer(56, -99);
            };
            expect(checker).to.throw('lower boundery m:56 should be lower then upper boundery n:-99');
        });
    });
    describe('object stets',()=>{
        it('object with scalar properties some optional',()=>{
            const schema ={
                id: V.integer(),
                name: V.string(0,30).optional,
                lastName: V.string(0,30)
            };
            const checker = V.object(schema).closed;
            const result = checker({
                id: 1234,
                name: 'Hans',
                lastName: 'Kazan'
            });
            expect(result).to.deep.equal([ { id: 1234, name: 'Hans', lastName: 'Kazan' }, undefined, undefined ]);
            const result2 = checker({
                id: 1234,
                name: 'Hans',
                lastName: 'Kazan',
                s: 'a' // should break because schema is closed
            });
            expect(result2).to.deep.equal([ null, 'The validating object schema is closed. Forbidden properties: [s this property is not allowed]', null ]);
            const result3 = checker({
                id: 1234,
                lastName: 'Kazan'
            });
            expect(result3).to.deep.equal([ { id: 1234, lastName: 'Kazan' }, undefined, undefined ]);
            const result4 = checker({
                id: 1234
            });
            expect(result4).to.deep.equal([ null, '[lastName] is manditory but absent from the object', null ]);
        })
    })
});