// describe it expect
const chai = require('chai');
const { expect } = chai;
const createPreprocessorOverlay = require('../lib/tokenizer/preprocess');


const cssSample = `
html, body, div, dl, dt, dd, ul, \r\nol, li, h1, h2, h3, h4, h5, h6, pre, a, form, fieldset, input[type="search"], textarea, p, blockquote, th, td {
  margin: 0;
  padding: 0;\r\n
}\n\r

input:focus, textarea:focus, keygen:focus, select:focus {
  outline-offset: -2px;
}
\u0000
div:before, select, * {
  box-sizing: border-box;\u000d 
}

button, input {\u000C
  line-height: normal;
}
`;
describe('css preprocessor overlay', () => {
  const overlay = createPreprocessorOverlay(cssSample);
  it('check all data before the first overlayed', () => { 
    const result = '\nhtml, body, div, dl, dt, dd, ul, \r\nol';
    const collect = [];
    for (let i = 0; i < cssSample.length; i++){
      collect.push(overlay[i]);
    }
    console.log(`>${collect.join('')}<`);
  });
});
