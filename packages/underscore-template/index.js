const _ = require('underscore');

const render1 = _.template(`
    <html>
      <head>
      <title><%=titleName%></title>
      </head>
    <body>
    </body>  
    </html>
`);


const render2 = _.template(`
    <html>
      <head>
      <title>{{ titleName+ Date.now()}}</title>
      </head>
    <body>
    </body>  
    </html>
`, {
        interpolate: /\{\{(.+?)\}\}/g
    }
);

const s = render1({ titleName: 'underscore-template-title' });
console.log(s);
console.log(render1.source);


const s2 = render2({ titleName: 'underscore-template-title' });
console.log(s2);
console.log(render2.source);




