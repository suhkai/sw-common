const path = require('path');
const tmpl = require('blueimp-tmpl');
const { add, diff, linkPositionFromFile } = require('./filetools');

const {
    V
} = require('../validator');

const isFunction = require('../validator/isFunction');

/* tests
const result1 = linkPositionFromFile(process.cwd(), '../images/1.jpg');
const result2 = linkPositionFromFile(process.cwd() + '/index.html', '../images/1.jpg');
const result3 = linkPositionFromFile(process.cwd() + '/index.html', process.cwd() + '/images/1.jpg');
const result4 = linkPositionFromFile('index.html', process.cwd() + '/images/1.jpg');
const result5 = linkPositionFromFile('a/b/c/index.html', '/a/b/images/1.jpg');
const result6 = linkPositionFromFile('b/c/index.html', 'a/b/images/1.jpg');
const result7 = linkPositionFromFile('b/c/index.html', 'b/c/images/1.jpg');
*/

const template = `
<html lang="en">
<head>
    <!--favicon injection-->
    <title>{%=o.title%}</title>
    <base href="{%=o.base_url%}" target="_blank">
    <!--css asset injection-->
    <!--js asset injection-->
</head>
<body>
    <div id="myApp"></div>
    <script src="bundlexyz.js"></script>
</body>
</html>`;

async function generate(){
   return tmpl(template, {title:'Rollup Sample App', base_url:'http://my-demo-app.com'});
};

generate().then(data=>console.log(data));

// ok i have a good design now for this