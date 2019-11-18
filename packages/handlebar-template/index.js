const handlebars = require('handlebars');
const source = `
<div class="entry">
<h1>{{title}}</h1>
<div class="body">
  {{body}}
</div>
</div>
`;
const fn = handlebars.compile(source);

const html = fn({ title: 'My New Post', body: 'This is my first post!' });
console.log(html);