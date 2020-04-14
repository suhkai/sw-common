// describe it expect
const chai = require('chai');
const { expect } = chai;
const consumeNumber = require('../../lib/tokenizer/consumers/number');

describe('consume numbers', () => {
  [
    { i: '123', o: { id: 10, start: 0, end: 2 } },
    { i: '+123.4', o: { id: 10, start: 0, end: 5 } },
    { i: '+45E9.4', o: { id: 10, start: 0, end: 6 } },
    { i: 'Abc', o: undefined },
    { i: '-+34', o: undefined },
    { i: '0.34', o: { id: 10, start: 0, end: 3 } },
    { i: '+45E-9.4', o:{ id: 10, start: 0, end: 7 } },
    { i: '45344 ', o:{ id: 10, start: 0, end: 4 } },
  ].forEach(d => {
    it(`consume "${d.i}"`, () => {
      const endinc = consumeNumber(d.i);
      if (d.o) {
        expect(endinc).to.deep.equal(d.o);
      }
    });
  })
  it(`consume "123456 "`, () => {
    const endinc = consumeNumber("123456 ");
    expect(endinc).to.deep.equal({ id: 10, start: 0, end: 5 });
  });
  it(`consume "1"`, () => {
    const endinc = consumeNumber("1");
    expect(endinc).to.deep.equal({ id: 10, start: 0, end: 0 });
  });
  it(`consume "1E" to undefined`, () => {
    const endinc = consumeNumber("1E");
    expect(endinc).to.be.undefined;
  });
  it(`consume (undefined) to undefined`, () => {
    const endinc = consumeNumber();
    expect(endinc).to.be.undefined;
  });
});
