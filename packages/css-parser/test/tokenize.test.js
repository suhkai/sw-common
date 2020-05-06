const fs = require('fs');
const { resolve } = require('path');
// describe it expect
const chai = require('chai');
const { expect } = chai;
const createPreprocessorOverlay = require('../lib/tokenizer/preprocess');
const tokenizer = require('../lib/tokenizer')

const fixture = fs.readFileSync(require.resolve('./fixtures/google-font.css'), 'utf8');
const source = createPreprocessorOverlay(fixture);



describe('token actual css', () => {

  let lexer;

  beforeEach(() => {
    lexer = tokenizer(source);
  })

  it('tokenstream test', () => {
    for (const token of lexer){
      //console.log(token);
    }
  });
});
