const tmpl = require('blueimp-tmpl');

const { V, addFeature, removeFeature } =  require('../validator');

const isTemplateObjectData = V.object({}).open; // anything goes
const IsTemplateString = V.string(2,);
const isTemplateArgs = V.string(1,);
const isFunction = V.function;
const isBoolean = V.boolean;
 
function validateOptions(o){

};

function render(o){

}

const fs = require('fs');
const data = {
    title: 'JavaScript Templates',
    url: 'https://github.com/blueimp/JavaScript-Templates',
    features: ['lightweight & fast', 'powerful', 'zero dependencies']
}

const oldLoad = tmpl.load; //Document.getElementById()
console.log(oldLoad.toString());

// but only if the source is a filename right?
tmpl.load = function(id){
    /*var filename = id + '.html'
    console.log('Loading ' + filename);
    return fs.readFileSync(filename, 'utf8');*/
    return src;
};

const src = `
<!DOCTYPE HTML>
<title>{%=o.title%}</title>
<h3><a href="{%=o.url%}">{%=o.title%}</a></h3>
<h4>Features</h4>
<ul>
{% for (var i=0; i<o.features.length; i++) { %}
    <li>{%=o.features[i]%}</li>
{% } %}
</ul>
`;

const result = tmpl('myfile', data); // like it is an DOM "id" or something  a real file name like './template.html' would not work
const result2 = tmpl(src, data); // like it is an DOM "id" or something  a real file name like './template.html' would not work
console.log(result);
console.log(result2);
console.log(Object.keys(tmpl.cache)); //will actually show the cache with key "myfile", not cached if template is not loaded from an DOM like "id" attribute 
console.log(tmpl.encode());



// (template-data, source) => (string)


```bash
npm install blueimp-tmpl
```

[github repo](https://github.com/blueimp/JavaScript-Templates)

options

temp_arg = 'p' (the object that willbe the template argument object) 
temp_helper = function (old_temp_helper) => return whatever
temp_func = oldfunc => (s,p1,p2,p3,p4,offset,str);


[str.replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter)


function replacer(match, p1, p2, p3, offset, string) {
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
  return [p1, p2, p3].join(' - ');
}

function(s, p1, p2, p3, p4, p5, offset, str) {

number of parameters will depend on the subgroups, so cant use arrow functions

function (originalFunction){
    retrun function(){
        handle arguments here..
    }
}