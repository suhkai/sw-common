// describe it expect
const chai = require('chai');
const { expect } = chai;
const escape = require('../../lib/tokenizer/consumers/escape');
const { macp } = require('../../lib/tokenizer/checks-and-definitions')

describe('definitions', () => {
  it(`maximum codepoint check <= "\\u10FFFF"`, () => {
    const res = macp('\u10FFFE');
    expect(res).to.be.true;
  });
  it(`maximum codepoint check > "\\u10FFFF"`, () => {
    const res = macp('\u110000');
    expect(res).to.be.false;
  });
  
});