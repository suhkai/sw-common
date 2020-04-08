// describe it expect
const chai = require('chai');
const { expect } = chai;
const consumeString = require('../../lib/tokenizer/consumers/string');

describe('consume strings', () => {
  [
  
  ].forEach(d => {
    it(`consume ${d.i}`, () => {
      const endinc = consumeNumber(d.i);
      if (d.o) {
        expect(endinc).to.deep.equal(d.o);
      }
    });
  })
});
