const html = `
<html>
<head>
<title>hello world</title>
</head>
<body>
<!--     some comment value    -->
<div>
event some randome text 
<span>can</span> 
be 
used as anchor*
</div>
<body>
</html>`;

const { parse, parseFragment, serialize } = require('parse5');
const { stringify } = require('flatted');
const jxpath = require('@mangos/jxpath');

const ast = parse(html);

// /[nodeName=h]/childNodes/[nodeName=html]/childNodes/[nodeName=head]/childNodes/[nodeName=title]/childNodes/value
console.log(jxpath('[nodeName=#document]/childNodes/[nodeName=html]/childNodes/[nodeName=body]/childNodes/[nodeName=#comment]/[data=/comment/]/', ast));
//html/body/#comment/[data=/comment/]/

console.log(stringify(ast));
/* something like 

html/head/comment/

*/