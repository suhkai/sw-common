const tmpl = require('blueimp-tmpl');

const { V, addFeature, removeFeature } = require('../validator');

const blueImpOptionValidator = V.object({
    helper: V.string().optional,
    arg: V.string().optional,
    parse_regexp: V.regexp.optional,
    parse_regexpfunc: V.function().optional,
    load: V.function(1).optional,
    outputFile: V.ifFalsy('index.html').string().optional
}).closed;

// posisble input options
const io1 = {
    input: 'src/main.js', // could be a string , default to single entry point
    output: {
        file: 'bundle.js',
        format: 'cjs'
    }
};

const io2 = {
    cache: true,
    input: { // could be this multiple entry points
        bundle: './es7.js',
    }
};



// initialize, options, -> returns error if unsucessfull or a new options object (sanitation);
//  ---> returns (newoptions( sanatized), errors)
// build ,=> optionally test initialized options, maybe resolve, use emitted resources from bundle
//  --> returns { filename (fullpath or not), html (generate html), errors: list of errors }

const oldLoad = tmpl.load; //Document.getElementById()
console.log(oldLoad.toString());

// but only if the source is a filename right?
tmpl.load = function (id) {
    /*var filename = id + '.html'
    console.log('Loading ' + filename);
    return fs.readFileSync(filename, 'utf8');*/
    return '<div>{%=o.ref%}</div>';
};

const src = `
<!DOCTYPE HTML>
{% _s+=tmpl('randomid', { ref:'c'}); %}
<title>{%=o.title%}</title>
<h3><a href="{%=o.url%}">{%=o.title%}</a></h3>
<h4>Features</h4>
<ul>
{% for (var i=0; i<o.features.length; i++) { %}
    <li>{%=o.features[i]%}</li>
{% } %}
</ul>
`;

const data = {
    ref: 'some reference',
    title: 'JavaScript Templates',
    url: 'https://github.com/blueimp/JavaScript-Templates',
    features: ['lightweight & fast', 'powerful', 'zero dependencies']
};

const result = tmpl(src, data); // like it is an DOM "id" or something  a real file name like './template.html' would not work
console.log(result);
console.log(Object.keys(tmpl.cache)); //will actually show the cache with key "myfile", not cached if template is not loaded from an DOM like "id" attribute 
console.log(tmpl.encode());

console.log(tmpl.encReg); ///[<>&"'\x00]/g, strange  \0x00 is not mapped to 
console.log(tmpl.encode.toString());
console.log(JSON.stringify(tmpl.encMap)); // a real JS object 

console.log(Object.getOwnPropertyNames(tmpl.encMap));
console.log(tmpl.helper);

/*
Map looks like this
{
    "<":"&lt;",
    ">":"&gt;",
    "&":"&amp;",
    "\"":"&quot;",
    "'":"&#39;"
}
*/