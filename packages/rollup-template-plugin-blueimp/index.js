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

   
}

function validate(outputOptions, pluginOptions, templateOptions){

    // returns [undefined, errors] in case of errors
    // returns [generate, undefined] in case of success
    return function generate(){

    }
}

module.exports = validate;