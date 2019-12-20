const path = require('path');
const tmpl = require('blueimp-tmpl');
const parse5 = require('parse5');
const getTokens = require('../validator/getTokens');
const objectSlice = require('../validator/objectSlice');
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

async function generate(bundles, outputOptions){
   return tmpl(template, {title:'Rollup Sample App', base_url:'http://my-demo-app.com'});
};

generate().then(text=>{
    
    // fucking beautyfull, works:
    const selector = getTokens('/childNodes/[nodeName=html]/childNodes/[nodeName=head]/childNodes/[nodeName=#comment]/');
    const data = parse5.parse(text);
    const result = objectSlice(data, selector);
    console.log(result);
    /* result ->
      [ 'favicon injection',
        'css asset injection',
        'js asset injection'
      ]
    */  

});

// ok i have a good design now for this

