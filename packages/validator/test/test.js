const chaiAsPromised = require('chai-as-promised');
const { describe, it, before, after } = require('mocha');
const chai = require('chai');
chai.should();
chai.use(chaiAsPromised);
const { expect } = chai;

const {
    // helpers
    isStringArray,
    isBooleanArray,
    isNumberArray,
    isInt,
    isObject,
    // forcers
    convertToNumber,
    convertToBoolean,
    // checkers
    createStringLengthRangeCheck,
    createRangeCheck,
    // tokenizers
    createValidator,
    createCollectionChecker,

} = require('../src/validator');


describe('validation tests', function () {
    describe('type conversions', () => {
        it('conversion to number', () => {
            const data = ['34234', 'xxEAZE', 4234];
            expect(convertToNumber(data[0])).to.deep.equal([34234, null]);
            expect(convertToNumber(data[1])).to.deep.equal([null, 'cannot convert to number']);
            expect(convertToNumber(data[2])).to.deep.equal([4234, null]);
        });
        describe('conversion to boolean', () => {
            const data = [
                { in: 'true', out: [true, null] },
                { in: 'TrUE', out: [true, null] },
                { in: 'False', out: [false, null] },
                { in: 'Falsex', out: [null, 'cannot convert to boolean'] },
                { in: false, out: [false, null] },
                { in: true, out: [true, null] },
                { in: null, out: [null, 'cannot convert to boolean for other then string type'] }
            ];
            for (const elt of data) {
                const msg = elt.out[1] ? `convert ${elt.in} to boolean should result in error` : `convert ${elt.in} to boolean should succeed`;
                it(msg, () => {
                    const input = elt.in; // copy value from closure, because changed in next iteration
                    const output = elt.out;
                    expect(convertToBoolean(input)).to.deep.equal(output);
                });
            }
        });
    });
    describe('helpers', () => {
        describe('isStringArray', () => {
            it('non array', () => {
                const [arr, err] = isStringArray({a:1});
                expect(arr).to.be.null;
                expect(err).to.equal('collection is not a array [object Object]');
            });
            it('empty array', () => {
                const [arr, err] = isStringArray([]);
                expect(arr).to.be.null;
                expect(err).to.equal('collection is not an empty array');
            });
            it('array of strings', () => {
                const data = ['a string', 'i like startrek'];
                const [arr, err] = isStringArray(data);
                expect(err).to.be.null;
                expect(arr).to.deep.equal(data);
            });
            it('array of non strings', () => {
                const data = [1, Symbol.for('zup'), true, 'a string', 'i like startrek'];
                const [arr, err] = isStringArray(data);
                expect(arr).to.be.null;
                expect(err).equal('not all elements were strings');
            });
        });
        describe('isNumberArray', () => {
            it('empty array test', () => {
                const [arr, err] = isNumberArray([]);
                expect(arr).to.be.null;
                expect(err).to.equal('collection is not an empty array');
            });
            it('array of numbers', () => {
                const data = [1, 334, 2345, NaN, Infinity];
                const [arr, err] = isNumberArray(data);
                expect(err).to.be.null;
                expect(arr).to.deep.equal(data);
            });
        });
        describe('isBooleanArray', () => {
            it('empty array test', () => {
                const [arr, err] = isBooleanArray([]);
                expect(arr).to.be.null;
                expect(err).to.equal('collection is not an empty array');
            });
            it('array of booleans', () => {
                const data = [false, true];
                const [arr, err] = isBooleanArray(data);
                expect(err).to.be.null;
                expect(arr).to.deep.equal(data);
            });
        });
        describe('isBooleanArray', () => {
            it('empty array test', () => {
                const [arr, err] = isBooleanArray([]);
                expect(arr).to.be.null;
                expect(err).to.equal('collection is not an empty array');
            });
            it('array of booleans', () => {
                const data = [false, true];
                const [arr, err] = isBooleanArray(data);
                expect(err).to.be.null;
                expect(arr).to.deep.equal(data);
            });
        });
        it('isInteger', () => {
            expect(isInt(1)).to.deep.equal([1, null]);
            expect(isInt(1.4)).to.deep.equal([null, 'not an integer']);
            expect(isInt(-Infinity)).to.deep.equal([null, 'not an integer']);
            expect(isInt({})).to.deep.equal([null, 'not a number']);
        });
        it('isObject', () => {
            const data = [{}, null, undefined, new Date, []];
            expect(isObject(data[0])).to.be.true;
            expect(isObject(data[1])).to.be.false;
            expect(isObject(data[2])).to.be.false;
            expect(isObject(data[3])).to.be.true;
            expect(isObject(data[4])).to.be.false;

        });
        it('createStringLengthRangeCheck', () => {
            expect(() => createStringLengthRangeCheck(-1, 12)).to.throw('lower boundery m:-1 should be >= 0');
            expect(() => createStringLengthRangeCheck(4, 2)).to.throw('lower boundery m:4 should be lower then upper boundery n:2');
            expect(() => createStringLengthRangeCheck('4', 2)).to.throw('lower boundery m:<string>4 MUST be of type number');
            expect(() => createStringLengthRangeCheck(4, '2')).to.throw('upper boundery n:<string>2 MUST be of type number');
            expect(() => createStringLengthRangeCheck(NaN, 2)).to.throw('lower boundery m is a NaN');
            expect(() => createStringLengthRangeCheck(4, NaN)).to.throw('upper boundery n is a NaN');
            const checker = createStringLengthRangeCheck(2, 10);
            const result1 = checker('some string longer the 10 chars');
            expect(result1).to.deep.equal([null, 'string of length:31 is not between 2 and 10 inclusive']);
            const result2 = checker('x');// to short
            expect(result2).to.deep.equal([null, 'string of length:1 is not between 2 and 10 inclusive']);
            const result3 = checker('hello');
            expect(result3).to.deep.equal(['hello', null]);
        });
        it('createRangeCheck', () => {
            const checker = createRangeCheck(1, 2);
            const result1 = checker(34);
            expect(result1).to.deep.equal([null, '34 is not between 1 and 2 inclusive']);
            const result2 = checker(1.2);
            expect(result2).to.deep.equal([1.2, null]);
            expect(()=>createRangeCheck(4, 2)).to.throw('lower boundery m:4 should be lower then upper boundery n:2');
            expect(()=>createRangeCheck('1', 2)).to.throw('lower boundery m:<string>1 MUST be of type number');
            expect(()=>createRangeCheck(1, '2')).to.throw('upper boundery n:<string>2 MUST be of type number');
            expect(()=>createRangeCheck(NaN, 100)).to.throw('lower boundery m is a NaN');
            expect(()=>createRangeCheck(0, NaN)).to.throw('upper boundery n is a NaN');
        });
        it('createCollectionChecker', () => {
            const checker = createCollectionChecker('string', ['DE','NL','GB']);
            const result1 = checker('DE');
            expect(result1).to.deep.equal([ 'DE', null ]);
            const result2 = checker('XX');
            expect(result2).to.deep.equal([ null, 'value is not part of the colelection' ]);
            const result3 = checker(1);
            expect(result3).to.deep.equal([ null, 'value is not of type string' ]);
        });
        //createCollectionChecker
        describe('string patterns', () => {
            describe('test simple string', () => {

            });
        });
    })
});