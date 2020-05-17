'use strict';

// describe it expect
const chai = require('chai');
const { expect } = chai;
const consumeUrlToken = require('../../lib/consumers/url');

xdescribe('consume url', () => {
  const d1 = 'url(./hello-world)';
  it(`consume "${d1}" as url-token`, () => {
    const t = consumeUrlToken(d1);
    //console.log(d1.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).to.deep.equal({ id: 7, start: 0, end: 17 });
  });
  
  const d2 = 'url( ./hello-world  )';
  it(`consume "${d2}" as url token`, () => {
    const t = consumeUrlToken(d2);
    //console.log(d2.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).to.deep.equal({ id: 7, start: 0, end: 20 });
  });

  const d3 = 'url( "./hello-world"  )';
  it(`consume "${d3}" as bad url token`, () => {
    const t = consumeUrlToken(d3);
    //console.log(d3.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).to.deep.equal({ id: 8, start: 0, end: 22 });
  });

  const d4 = 'url( "./\\hello-world"  )';
  it(`consume "${d4}" as bad url token but still with an escape`, () => {
    const t = consumeUrlToken(d4);
    //console.log(d4.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).to.deep.equal({ id: 8, start: 0, end: 23 });
  });

  const d5 = 'url( ./\\hello-world  )';
  it(`consume valid escaped url "${d5}"`, () => {
    const t = consumeUrlToken(d5);
    //console.log(d5.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).deep.equal({ id: 7, start: 0, end: 21 });
  });

  const d6 = 'url( ./\\\nhello-world  )';
  it(`consume invalidvalid url, because invalidly espaped "${d6}"`, () => {
    const t = consumeUrlToken(d6);
    //console.log(d6.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).to.deep.equal({ id: 8, start: 0, end: 22 });
  });

  const d7 = 'url( hi';
  it(`consume url hitting EOF is still valid "${d7}"`, () => {
    const t = consumeUrlToken(d7);
    //console.log(d7.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).to.deep.equal({ id: 7, start: 0, end: 6 });
  });

  const d8 = 'rgba(0,1,3,4);';
  it(`non url css function "${d8}"`, () => {
    const t = consumeUrlToken(d8);
    //console.log(d8.slice(t.start, t.end + 1))
    //console.log(t);
    expect(t).to.deep.equal({ id: 8, start: 0, end: 12 });
  });

});