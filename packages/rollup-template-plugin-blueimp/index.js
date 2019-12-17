const path = require('path');
const tmpl = require('blueimp-tmpl');


const {
    V
} = require('../validator');

const isFunction = require('../validator/isFunction');


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