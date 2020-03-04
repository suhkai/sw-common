const csstree = require('css-tree');

var ast = csstree.parse(
    `
@import "common.css" screen;
@media only screen and (max-width: 600px) {
    body {
      background-color: lightblue;
    }
}
body {
    background: url("http://somewhere.com/someurl.jpg");
}
ul {
    list-style-image: url(images/bullet.png);
}
`,
    {
        filename: 'somefile.css',
        positions: false
    }
);

function findTypeForward(listNode, name) {
    if (listNode.data.type === name) {
        return listNode.data;
    }
    if (listNode.next === null) {
        return;
    }
    return findTypeForward(listNode.next, name);
}

function testForQuotes(str, i) {
    return '\"\''.includes(str[i]) && str[i - 1] !== '\\'
}

function stripQ(str = '') {
    let start;
    for (start = 0; start < str.length && testForQuotes(str, start); start++);
    let end;
    for (end = str.length - 1; end >= start && testForQuotes(str, end); end--);
    if (start === 0 && end === str.length - 1) {
        return str;
    }
    return str.slice(start, end + 1);
}

csstree.walk(ast, function (node) {
    // import rules
    console.log(`${node.name}\t${node.type}`);
    if (node.type === 'Atrule' && node.name === 'import') {
        const url = findTypeForward(node.prelude.children.head, 'String');
        console.log(url);
    }
    if (node.type === 'Url') { // use of url function look here https://developer.mozilla.org/en-US/docs/Web/CSS/url()
        node.value.value = './somewherelse.jpg';
        console.log(node.value)
        // handle all cases of url
    }
});

console.log(csstree.generate(ast))
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

/**
List {
  createItem: [Function: createItem],
  updateCursors: [Function],
  getSize: [Function],
  fromArray: [Function],
  toArray: [Function],
  toJSON: [Function],
  isEmpty: [Function],
  first: [Function],
  last: [Function],
  each: [Function],
  forEach: [Function],
  eachRight: [Function],
  forEachRight: [Function],
  nextUntil: [Function],
  prevUntil: [Function],
  some: [Function],
  map: [Function],
  filter: [Function],
  clear: [Function],
  copy: [Function],
  prepend: [Function],
  prependData: [Function],
  append: [Function],
  appendData: [Function],
  insert: [Function],
  insertData: [Function],
  remove: [Function],
  push: [Function],
  pop: [Function],
  unshift: [Function],
  shift: [Function],
  prependList: [Function],
  appendList: [Function],
  insertList: [Function],
  replace: [Function] }
*/