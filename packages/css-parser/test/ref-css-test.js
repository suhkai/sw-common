const fs = require('fs');
const { resolve } = require('path');

// the reference can be found at https://www.npmjs.com/package/css

const chai = require('chai');
const { expect } = chai;
const parse = require('../lib/reference/parse')
const stringify = require('../lib/reference/stringify')

const fixture = fs.readFileSync(require.resolve('./fixtures/google-font.css'), 'utf8');


describe('css ref test', () => {
  let result
  it('parse fixture', () => {
        result = parse(fixture,{});
        //console.log(result);
  });
  it('serialize fixture',()=>{
     const str = stringify(result)
     //console.log(str)
  })

  it('serialize fixture',()=>{
    const serialized = stringify(result, { sourcemap: true})
    console.log(serialized.map)
 })


});
