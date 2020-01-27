'use strict';

// this will not work because it is a GIF, tesseract.js only does, PNG, its stupid
const url = 'http://dl-models.com/cgi-bin/sblogin/turingimage.cgi?1';

const Tesseract = require('tesseract.js');

Tesseract.recognize(
    url,
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log(text);
  })