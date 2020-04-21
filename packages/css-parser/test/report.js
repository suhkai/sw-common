'use strict';
const fs = require('fs');
const { resolve } = require('path');
// describe it expect
const chai = require('chai');
const { expect } = chai;
const createPreprocessorOverlay = require('../lib/tokenizer/preprocess');
const tokenizer = require('../lib/tokenizer')

const fixture = fs.readFileSync(require.resolve('./fixture.css'), 'utf8');
const source = createPreprocessorOverlay(fixture);

// TODO put this in preport
/**
 * 
 * span {
  outline: 1px black solid;
}
._13 {
  color: red;
}

._10 {
  color: orange;
}

._25 {
  color: cyan;
  clear: both;
  display: block;
}

._3 {
  color:black;
  font-weight: 900;
  font-family: arial;
}

._7 {
  color:purple;
  font-weight: 900;
  font-family: arial;
}



._1 {
  color:red;
}
._5 {
  color: green;
}
 */


const lexer = tokenizer(source);
const arr = Array.from(lexer);
// now create htmlreport

const html = arr.map(tok => {
   const data = source.slice(tok.start, tok.end+1);
   return `<span class="_${tok.id}" >${data}</span>`;
});

console.log(html.join(''));