// describe it expect
const chai = require('chai');
const { expect } = chai;
const { macp, isIdStart, isNumberStart, isBOM } = require('../../lib/checks-and-definitions')

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
  xdescribe('idNamestart', () => {
    it('-moz is start of id', () => {
      const res = isIdStart('-', 'm', 'o')
      expect(res).to.be.true;
    });
    it('"--someid" is start of id', () => {
      const res = isIdStart('-', '-', 's')
      expect(res).to.be.true;
    });
    it('"-\\n" is start of id', () => {
      const res = isIdStart('-', '\\', 'n')
      expect(res).to.be.true;
    });
    it('"samename" is start of id', () => {
      const res = isIdStart('s', 'a', 'm')
      expect(res).to.be.true;
    });
    it('"\\samename" is start of id', () => {
      const res = isIdStart('\\', 's', 'a')
      expect(res).to.be.true;
    });
    it('"[\\u0004]normal" is NOT a start of an id', () => {
      const res = isIdStart('\u0004', 'o', 'm')
      expect(res).to.be.false;
    });
  });
  xdescribe('numberStart', () => {
    it('+123 or -123', () => {
      let res = isNumberStart('+', '1')
      expect(res).to.equal(2);
      res = isNumberStart('-', '1')
      expect(res).to.equal(2);
    });
    it('+.123 or -.123', () => {
      let res = isNumberStart('+', '.', '1')
      expect(res).to.equal(3);
      res = isNumberStart('-', '.', '1')
      expect(res).to.equal(3);
    });
    it('+.a123 or -.x2', () => {
      let res = isNumberStart('+', '.', 'a')
      expect(res).to.equal(0);
      res = isNumberStart('-', '.', 'x')
      expect(res).to.equal(0);
    });
    it('.123', () => {
      let res = isNumberStart('.', '1', 'e')
      expect(res).to.equal(2);
    });
    it('.a', () => {
      let res = isNumberStart('.', 'a')
      expect(res).to.equal(0);
    });
    it('.a', () => {
      let res = isNumberStart('.', 'a')
      expect(res).to.equal(0);
    });
    it('a', () => {
      let res = isNumberStart('a', 'z')
      expect(res).to.equal(0);
    });
    it('123', () => {
      let res = isNumberStart('1', 'x')
      expect(res).to.equal(1);
    });
  });
  
});