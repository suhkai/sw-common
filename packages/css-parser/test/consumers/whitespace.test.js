// describe it expect
const chai = require('chai');
const { expect } = chai;
const { findWhiteSpaceEnd } = require('../../lib/tokenizer/utils');

describe('consume whitespace', () => {
  //          01é34
  it('consume "     zeaze"', () => {
    const t = findWhiteSpaceEnd('     zeaze');
    expect(t).to.equal(4);
  });
  it('consume "no spaces"', () => {
    const t = findWhiteSpaceEnd('gekko');
    expect(t).to.equal(0);
  });
  it('consume trailing spaces', () => {
    //012345678
    const t = findWhiteSpaceEnd('gekko    ', 5);
    expect(t).to.equal(8);
  });
  it('consume intermediate spaces', () => {
    //012345678 
    const t = findWhiteSpaceEnd('gekko    bird', 5);
    expect(t).to.equal(8);
  });
});
