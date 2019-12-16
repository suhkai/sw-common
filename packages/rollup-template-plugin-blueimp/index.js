const path = require('path');
const tmpl = require('blueimp-tmpl');
const { add, diff, linkPositionFromFile } = require('./filetools');

const {
    V
} = require('../validator');

const isFunction = require('../validator/isFunction');

/* tests
const result1 = linkPositionFromFile(process.cwd(), '../images/1.jpg');
const result2 = linkPositionFromFile(process.cwd() + '/index.html', '../images/1.jpg');
const result3 = linkPositionFromFile(process.cwd() + '/index.html', process.cwd() + '/images/1.jpg');
const result4 = linkPositionFromFile('index.html', process.cwd() + '/images/1.jpg');
const result5 = linkPositionFromFile('a/b/c/index.html', '/a/b/images/1.jpg');
const result6 = linkPositionFromFile('b/c/index.html', 'a/b/images/1.jpg');
const result7 = linkPositionFromFile('b/c/index.html', 'b/c/images/1.jpg');
*/

console.log(result3);

function validate(outputOptions, pluginOptions, templateOptions) {
    const blueImpOptionValidator = V.object({
        helper: V.function(1).optional,
        arg: V.string().optional,
        parse_regexp: V.regexp.optional,
        parse_regexpfunc: V.function().optional,
        load: V.function(1).optional,
        getTemplate: V.function(assets)
    }).closed;
    const [, errors] = blueImpOptionValidator(templateOptions);
    if (error) {
        return [undefined, errors.join('\\n')];
    }

    if (templateOptions.helper) {
        tmpl.helper = templateOptions.helper(templ.helper);
    }

    if (templateOptions.arg) {
        tmpl.arg = templateOptions.arg;
    }

    if (templateOptions.parse_regexp) {
        tmpl.regexp = templateOptions.parse_regexp;
    }
    if (templateOptions.parse_regexpfunc) {
        const wrapped = templateOptions.parse_regexpfunc(tmpl.func);
        if (isFunction(wrapped)) {
            tmpl.func = wrapped;
        }
        else {
            return [undefined, `parse_regexpfun did not return the function needed by blueimp tmpl.func`];
        }
    }

    const fileNameChecker = V.object({
        fileName: V.ifFalsy('index.html').filename
    }).open;

    const [, errors] = fileNameChecker(pluginOptions);
    if (error) {
        return [undefined, errors.join('\\n')];
    }

    const rc = function generate(assets) {
        const [templateString, templateData] = templateOptions.getTemplate(assets);
        return tmpl(templateString, templateData);
    };
    return [rc, undefined];
}

module.exports = validate;