'use strict';
const fs = require('fs');
const { resolve } = require('path');
// describe it expect
const chai = require('chai');
const { expect } = chai;
const createPreprocessorOverlay = require('../lib/tokenizer/preprocess');
const tokenizer = require('../lib/lexer')

const fixture = fs.readFileSync(require.resolve('./fixtures/main.css'), 'utf8');
const source = createPreprocessorOverlay(fixture);

const css = `
<style>
span {
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
</style>
`;

const html = `
<!DOCTYPE html>
<html lang="en" base="http://somebase.com/today">
<head>
 <title>output tokens</title>
 {{css}}
</head>
<body>
<div>
 {{snippet}}
</div>
</body>
</html>
`



const lexer = tokenizer(source);
const arr = Array.from(lexer);
// now create htmlreport

const snippet = arr.map(tok => {
   const data = source.slice(tok.start, tok.end+1);
   return `<span class="_${tok.id}" >${data}</span>`;
}).join('');

const final = html.replace('{{snippet}}', snippet).replace('{{css}}', css)

console.log(final);