const chaiAsPromised = require('chai-as-promised');
const {
    describe,
    it,
    before,
    after
} = require('mocha');
const chai = require('chai');
chai.should();
chai.use(chaiAsPromised);
const {
    expect
} = chai;

const {
    UNCLongShortAbsorber
} = require('../src/filepath/tokenizer');

describe('filepath', () => {
    describe('lexer unc root token', () => {
        describe('errors', () => {
            it('unc long root token without servername "//?/UNC/"', () => {
                const path = '\\\\?\\UNC\\';
                const answer = Array.from(UNCLongShortAbsorber('//?/UNC/', path, 0, path.length - 1));
                console.log(answer, answer[0].value && answer[0].value.length);
            });
            it('unc long root token without drive mount "//?/UNC/myserver/"', () => {
                const path1 = '\\\\?\\UNC\\z\\';
                const path2 = '\\\\?\\UNC\\z';
                const answer1 = Array.from(UNCLongShortAbsorber('//?/UNC/', path1, 0, path1.length - 1));
                const answer2 = Array.from(UNCLongShortAbsorber('//?/UNC/', path2, 0, path2.length - 1))
                console.log(answer1, answer1[0].value && answer1[0].value.length);
                console.log(answer2, answer2[0].value && answer2[0].value.length);
            });
        });
    })
})