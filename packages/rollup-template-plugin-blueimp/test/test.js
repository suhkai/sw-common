

const tmpl = require('blueimp-tmpl');

const chaiAsPromised = require('chai-as-promised');
const {
    describe,
    it,
    before,
    after
} = require('mocha');
const chai = require('chai');
chai.should();
chai.use(chaiAsPromised);
const {
    expect
} = chai;

describe('template', () => {
    const example = `
    <html lang="en">
    <head>
        {% for (var i=0; i<o.inject_html.length; i++) { %}
            <!--{%=o.inject_html[i].comment%} --> 
            {% for (var j=0; j<o.inject_html[i].tags.length; j++) { %}
            {%   var tag = o.inject_html[i].tags[j].name;   %}
                 <{%print(tag)%}></{%print(tag)%}>
            {% }  %}     
        {% }  %}    
    `;

    // "you get an array of this", maybe use "inlcude" for blueimp

    // elt.nodeName , "link", script, meta
    // elt.children , "" makes only sense for comment
    // elt.attributes, "link, script, meta,"

    it('create custom tag', () => {
        const templ1 = `
        <html lang="en">
          {% for (const elt of o.html) { %}
          {% if (elt.tag==='comment') { %}
             <!--{%=elt.value%}-->
          {% } %}
          {% } %}   
        </html>
        `;
        const data = tmpl(templ1, {
            html: [
                {  tag: 'comment',
                   value: 'general section'
                }
            ]
        });
        console.log(data)
    })

});
