// describe it expect
const chai = require('chai');
const { expect } = chai;
const escape = require('../../lib/tokenizer/consumers/escape');
const { isValidEscape } = require('../../lib/tokenizer/definitions')

describe('consume escaped', () => {
  it(`invalid escape "\\\\n"`, () => {
    const res = isValidEscape('\\', '\n');
    expect(res).to.be.false;
  });
  it(`invalid escape "\\"`, () => {
    const res = isValidEscape('\\');
    expect(res).to.be.false;
  });
  it(`valid escape (tricky) "\\n"`, () => {
    const res = isValidEscape('\\', 'n');
    expect(res).to.be.true;
  });
  it(`consume hexdigit + space "\\123456 "`, () => {
    const endinc = escape("\\123456 ", 0);
    const res = "\\123456 ".slice(0, endinc + 1)
    expect(res).to.equal('\\123456 ');
  });
  it(`consume 6 out of 10 hexdigits  "\\1234566789a"`, () => {
    const endinc = escape("\\1234566789a", 0);
    const res = "\\1234566789a".slice(0, endinc + 1)
    expect(res).to.equal('\\123456');
  });
  it(`nonhexdidgit character "'\\123zz"`, () => {
    const endinc = escape("\\123zz", 0);
    const res = "\\123zz".slice(0, endinc + 1)
    expect(res).to.equal('\\123');
  });
  it(`escaped "'\\n"`, () => {
    const endinc = escape("\\n");
    const res = "\\n ".slice(0, endinc + 1)
    expect(res).to.equal('\\n');
  });
});