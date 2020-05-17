// describe it expect
const chai = require('chai');
const { expect } = chai;
const consumeName = require('../../lib/consumers/name');

xdescribe('consume name', () => {
    it('consume "hello world"', () => {
      const d = 'hello world'
      const endinc = consumeName(d);
      expect(d.slice(0, endinc+1)).to.equal('hello')
    });
    it('consume escaped "bonjour\\01tout le monde"', () => {
      const d = 'bonjour\\01tout le monde'
      const endinc = consumeName(d);
      expect(d.slice(0, endinc+1)).to.equal('bonjour\\01tout')
    });
    it('consume escaped "  n"', () => {
      const d = '   n'
      const endinc = consumeName(d);
      expect(endinc).to.equal(0);
    });
});
