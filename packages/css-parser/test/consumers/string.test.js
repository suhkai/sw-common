// describe it expect
const chai = require('chai');
const { expect } = chai;
const consumeString = require('../../lib/tokenizer/consumers/string');

describe('consume strings', () => {
  const d1 = 'consumed~"';
  it(`consume "${d1}`, () => {
    const t = consumeString(d1, '"');
    expect(d1.slice(t.start, t.end + 1)).to.deep.equal('consumed~');
  });
  const d3 = 'hello world~"';
  it('consume string token hitting EOF', () => {
    const t = consumeString(d3, '"', 0, d3.length - 2);
    expect(t).to.deep.equal({ id: 5, start: 0, end: 11 });
  });
  const d4 = 'consumed\n~"';
  it('consume string token with linefeed', () => {
    const t = consumeString(d4, '"');
    //console.log(d4.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).to.deep.equal({ id: 6, start: 0, end: 7 });
  });
  const d5 = 'consumed\\\n"';
  it('consume string token with invalid escape', () => {
    const t = consumeString(d5, '"');
    //console.log(d5.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).to.deep.equal({ id: 6, start: 0, end: 8 });
  });
  const d6 = 'consumed\\\n"';
  it('consume string token with escape at EOF', () => {
    const t = consumeString(d6, '"', 0 , d6.length -2);
    //console.log(d6.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).to.deep.equal({ id: 5, start: 0, end: 9 });
  });
  const d7 = 'consumed\\01234 "';
  it('consume string token with valid escape', () => {
    const t = consumeString(d7, '"');
    //console.log(`*${d7.slice(t.start, t.end + 1)}*`)
    //console.log(t);
    expect(t).to.deep.equal({ id: 5, start: 0, end: 14 });
  });
});
