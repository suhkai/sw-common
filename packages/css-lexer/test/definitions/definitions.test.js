// describe it expect
const chai = require('chai');
const { expect } = chai;
const { macp, isIdStart, isNumberStart, isBOM } = require('../../lib/lexer/checks-and-definitions')

describe('definitions', () => {
  describe('BOM check', () => {
    it('UTF16-LE', () => {
      const res = isBOM('\uFEFF some text'[0]);
      expect(res).to.be.true;
    });
    it('UTF16-BE', () => {
      const res = isBOM('\uFFFE some text'[0]);
      expect(res).to.be.true;
    });
    it('no bom', () => {
      const res = isBOM('some text'[0]);
      expect(res).to.be.false;
    });
  });
  describe('codepoint check', () => {
    it(`maximum codepoint check <= "\\u10FFFF"`, () => {
      const res = macp('\u10FFFE');
      expect(res).to.be.true;
    });
    it(`maximum codepoint check > "\\u10FFFF"`, () => {
      const res = macp('\u110000');
      expect(res).to.be.false;
    });
  });
});