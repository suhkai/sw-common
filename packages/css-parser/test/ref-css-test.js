const fs = require('fs');
const { resolve } = require('path');

const chai = require('chai');
const { expect } = chai;
const parse = require('../lib/reference/parse')

const fixture = fs.readFileSync(require.resolve('./fixtures/google-font.css'), 'utf8');


describe('css ref test', () => {

  it('parse fixture', () => {
        const result = parse(fixture,{});
        console.log(result);
  });
});
