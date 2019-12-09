const tmpl = require('blueimp-tmpl');
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
