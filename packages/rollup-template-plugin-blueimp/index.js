const path = require('path');

const tmpl = require('blueimp-tmpl');

const {
    V
} = require('../validator');

const blueImpOptionValidator = V.object({
    helper: V.string().optional,
    arg: V.string().optional,
    parse_regexp: V.regexp.optional,
    parse_regexpfunc: V.function().optional,
    load: V.function(1).optional,
    // make a file validator , remove below option, this should only concern generation of (htmlstring)
    //  via the template thats all
    outputFile: V.ifFalsy('index.html').string(5) // move it up one level, generation is here the issue 
    // create filename validator -> relative, must have name.extension and optional basepath/root
}).closed;

// prolly the only callback is to generate

//paths can be messy affair, because platform diffs, make sure we are comparing the same thing 

function options(outputOptions, templateOptions) {
    const [blueImpOptions, error] = blueImpOptionValidator(oo);
    if (error) {
        return [undefined, error];
    }
    // relative ../../ is forbidden
    // absolute is forbidden unless it includes the full basedir of the output.file or output.dir
    const normalPathHTML = normalizePath(blueImpOptions.outputFile);
    // do below steps in "outputOptions" hook 
    //  (so you get this as errors soon as possible, incase it is buildinga huge project)
    
    // if "file" is not absolute, make it so relative to current working dir (cwd)
    // if "dir" is not absolute, make it so relative to current working dir(cwd)
    // if there is no "file" AND no "dir" specified then emit error
    // if  "file" takes precedence over "dir"
    // if  "file"
    //     make absolute path as described above for file
    //     strip basename.ext from "file"
    //     if "htmlFile" is not absolute, simply resolve to full resolve(dirname(file), htmlfile) 
    //     if "htmlFile" is absolute then take it as is, later when injecting assets need to calculate relative paths
    // if "dir"
    //    make absolute as described in above for dir
    //   if "htmlFIle" is not absolute, simply resolve to full resolve(dir, html)
    //   if "htmlFile" is absolute, later with asset injection calculate the "relative offsets"

    //  otpional: on global level you can say 'assets on same path-"level" of html file or above'
    //  
    // at the end keep the absolute file of the html as is
    // return the string version of the html file
    
    // return the string, thats all, the upper level with parse it with "parse5"

    if (outputOptions.file){
        if (!path.isAbsolute(file)){
            
        }
    }
        
        const info = path.parse(htmlFile);
        
    }
    
    if (file && !dir) {
        const info = path.parse(file);
        basedir = path.format({
            root: info.root,
            dir: info.dir
        });
    } else if (!file && dir) {
        baseDir = dir
    } else if (file && dir){ // possible

    }
    //
    // Output    is a dir or a file?
    //
}

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