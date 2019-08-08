'use strict'
// referenced: https://www.w3.org/TR/mediaqueries-4/#aspect-ratio


// width
// (min-width: 25cm)
// (400px <= width <= 700px)  this doesnt work

//  height
//  use min, max same as "width"

//  ratio, but still a range rule
//  rational  number m/n , with m ∈ N+, n ∈ N+ 
//  OR a real number
//  

// orientation
// descrete
// portrait or landscape

// resolution
// range
//   infinite (like vector displays)
//   (resolution > 1000 dpi)
//   (resolution >= 2dppx) // css/device pixel ratio is 2
//   (min-resolution: 118dpcm)

// color
// range
// (color)
// (min-color: 1) // monochrome
// (color >= 8) // 8 bits of color

// monochrome
// range
//
// Interaction media features (todo)

// pointer or also "any-pointer"
// none|coarse|fine
// descrete

// hover or also "any-hover"
// none|hover
// descrete
// @media (hover) // also works

// Summary doesnt seem to be that much, primer can wrap this system wide events sending it to document.body for integration by some toolchain

const mqList = window.matchMedia('(any-pointer)');
console.log(`matches now?: ${mqList.matches}`);
console.log(`media key: ${mqList.media}`); // if this is "not all" then the query is invalid
mqList.addListener( e =>{
  console.log(e);
});

export {}