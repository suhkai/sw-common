const ejs = require('ejs');

const people = ['geddy', 'neil', 'alex'];

const options = {
    compileDebug: true
};

const html = ejs.render('<div><%= people.join(", "); %></div>', {people}, options);

console.log(html);