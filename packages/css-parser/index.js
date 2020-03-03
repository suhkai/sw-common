const csstree = require('css-tree');

var ast = csstree.parse(
`
@media only screen and (max-width: 600px) {
    body {
      background-color: lightblue;
    }
}
`,
{
   filename: 'somefile.css',
   atrule: { 'media': 'something' },
   positions: false
}    
);

csstree.walk(ast, function(node) {
    //console.log(node.type)
    if (node.type==='AtrulePrelude'){
        console.log(JSON.stringify(node, null, 4));
    }
});
/*
StyleSheet
Atrule
AtrulePrelude
MediaQueryList
MediaQuery
Identifier
WhiteSpace
Identifier
WhiteSpace
Identifier
WhiteSpace
MediaFeature
Dimension
Block
Rule
SelectorList
Selector
TypeSelector
Block
Declaration
Value
Identifier
*/
/*
https://github.com/csstree/csstree/blob/master/docs/parsing.md#atrule

atrule
Type: string or null
Default: null

Using for atrulePrelude context to apply atrule specific parse rules.
*/