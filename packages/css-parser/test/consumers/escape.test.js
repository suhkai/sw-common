// describe it expect
const chai = require('chai');
const { expect } = chai;
const escape = require('../../lib/tokenizer/consumers/escape');

describe('consume escaped', () => {
  [
  
  ].forEach(d => {
    it(`consume ${d.i}`, () => {
      const endinc = escape(d.i);
      if (d.o) {
        expect(endinc).to.deep.equal(d.o);
      }
    });
  })
});