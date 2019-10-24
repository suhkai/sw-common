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
        describe('string patterns', () => {
            describe('test simple string', () => {

            });
        });
    })
});