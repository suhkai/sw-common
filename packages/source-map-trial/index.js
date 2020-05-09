const sm = require('source-map');
const  { SourceMapGenerator }  = sm
const generator = new SourceMapGenerator({
    file:'bundle.js',
    sourceRoot:'https://www.jacob-bogers.com',
    skipValidation: false 
})

generator.setSourceContent('./original.js','the quick brown fox jumps over the lazy dog')
/*
generator.addMapping({
    source: "fun.r",
    original: { line: 1, column: 0 },
    generated: { line: 1, comumn: 2 }, // there was like a comment line
    name: 'dragon'
})

//console.log(generator.toString())
*/