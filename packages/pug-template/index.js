const pug = require('pug');
const p5 = require('parse5');
const stringify = require('json-stringify-safe');

const fn = pug.compileFile('./template.pug',{ doctype:'xml', self:true, debug: false, compileDebug:true, globals:['location']});
//console.log(fn);

console.log(typeof fn);

if (typeof fn === 'function'){
   // console.log(fn.toString());
    console.log(fn({ author: 'my name', copyright: '© 2019 Jacob Bogers'}));
    const ast = p5.parse(fn({x:'y'}));
    console.log(p5.serialize(ast));
}
  
/*Options ¶
All API methods accept the following set of options:

filename: string
    The name of the file being compiled. Used in exceptions, and required for relative include\s and extend\s. Defaults to 'Pug'.
basedir: string
    The root directory of all absolute inclusion.
doctype: string
    If the doctype is not specified as part of the template, you can specify it here. It is sometimes useful to get self-closing tags and remove mirroring of boolean attributes. See doctype documentation for more information.
pretty: boolean | string
    [Deprecated.] Adds whitespace to the resulting HTML to make it easier for a human to read using '  ' as indentation. If a string is specified, that will be used as indentation instead (e.g. '\t'). We strongly recommend against using this option. Too often, it creates subtle bugs in your templates because of the way it alters the interpretation and rendering of whitespace, and so this feature is going to be removed. Defaults to false.
filters: object
    Hash table of custom filters. Defaults to undefined.
self: boolean
    Use a self namespace to hold the locals. It will speed up the compilation, but instead of writing variable you will have to write self.variable to access a property of the locals object. Defaults to false.
debug: boolean
    If set to true, the tokens and function body are logged to stdout.
compileDebug: boolean
    If set to true, the function source will be included in the compiled template for better error messages (sometimes useful in development). It is enabled by default, unless used with Express in production mode.
globals: Array<string>
Add a list of global names to make accessible in templates.
cache: boolean
If set to true, compiled functions are cached. filename must be set as the cache key. Only applies to render functions. Defaults to false.
inlineRuntimeFunctions: boolean
Inline runtime functions instead of require-ing them from a shared version. For compileClient functions, the default is true (so that one does not have to include the runtime). For all other compilation or rendering types, the default is false.
name: string
The name of the template function. Only applies to compileClient functions. Defaults to 'template'.
*/