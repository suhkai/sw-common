const tmpl = require('blueimp-tmpl');
const fs = require('fs');
const data = {
    title: 'JavaScript Templates',
    url: 'https://github.com/blueimp/JavaScript-Templates',
    features: ['lightweight & fast', 'powerful', 'zero dependencies']
}
const oldLoad = tmpl.load;
console.log(oldLoad.toString());

tmpl.load = function(id){
    var filename = id + '.html'
    console.log('Loading ' + filename);
    return fs.readFileSync(filename, 'utf8');
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

const result = tmpl(src, data);
console.log(result);
console.log(Object.keys(tmpl.cache));
//tmpl.encode();
