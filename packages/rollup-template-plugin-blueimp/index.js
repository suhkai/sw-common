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
    <div id="myApp">hello</div>
    <script src="bundlexyz.js">not legal</script>
</body>
</html>`;

async function generate(bundles, outputOptions){
   return tmpl(template, {title:'Rollup Sample App', base_url:'http://my-demo-app.com'});
};

generate().then(text=>{
    
    // fucking beautyfull, works: /html/head/comment
    const selector = getTokens('/childNodes/[nodeName=html]/childNodes/[nodeName=body]/childNodes/[nodeName=script]/childNodes');
    const data = parse5.parse(text);
    const result = objectSlice(data, selector);
    console.log(result);
    /* result ->
      [ 'favicon injection',
        'css asset injection',
        'js asset injection'
      ]
    */

  const data2 =  {
    titles: [{language: 'en', text: 'Title'}, {language: 'sv', text: 'Rubrik'}]
   };
   const selector2 = getTokens('/titles/[language=en]/text'); // selects [ 'Title' ]
   const result2 = objectSlice(data2, selector2);
   console.log(result2);

   const data3 =  {
    titles: [{language: 'en', text: 'Title'}, {language: 'sv', text: 'Rubriek'}]
   };

   const selector3 = getTokens('/titles/[\\/(la|te)\\/=\\/e\\/]/text'); // selects [ 'Title', 'Rubriek' ]
   const result3 = objectSlice(data3, selector3);
   console.log(result3);
});

// ok i have a good design now for this

