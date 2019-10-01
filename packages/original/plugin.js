const { relative, resolve } = require('path');
require('colors');
const name = 'html';

const addSuffix = (path, suffix) => {
  if (!suffix) return path;

  const param = suffix === true ? `s=${Date.now()}` : suffix;
  return `${path}?${param}`;
};

const forceArray = a => Array.isArray(a) ? a : [a];

/**
 * generate html to serve a static site bundle
 * @param {!Object} opts - plugin options
 * @param {!string} opts.dir - path to output directory containing assets and bundle
 * @param {!(boolean|string)} [opts.css = false] - path to css file.
 *   typically the value of rollup-plugin-postcss' `extract` option.
 * @param {!string} [opts.filename = index.html] - filename of the output html
 * @param {!(string[]|string)} [opts.moreScripts = []] - additional scripts that should be injected
 *   into the output html, useful for loading libraries via a cdn instead the bundle
 * @param {!(string[]|string)} [opts.moreStyles = []] - like `opts.moreScripts`, but for css
 * @param {!(boolean|string)} [opts.suffix = false] - adds a suffix to the script and css filename
 * @param {!Object} [opts.template = {}] - custom template options
 * @param {?Function} opts.template.func - wrapper function used for custom templating engines.
 *   has signature `(templateStr, templateData) => finalHtml`,
 *   where `templateStr` is the contents of the custom template (`opts.template.path`)
 *   and `templateData` is the result of merging `opts.title` and `opts.template.data`
 *   with two array properties, `scripts` and `styles`.
 *   `scripts` is `opts.moreScripts` with the path to the bundle `opts.dir` appended.
 *   `styles` is `opts.moreStyles` with `opts.css` appended, if given.
 *   this function should call whatever custom templating engine api necessary with the arguments
 *   in order to return `finalHtml`, a string of html that the plugin will save.
 * @param {?string} opts.template.path - path to custom template.
 *   if `func` is not given, the default doT engine will be used.
 *   the plugin will inject template strings to handle `scripts` and `styles` data if necessary.
 * @param {!Object} [opts.template.data = {}] - template data object.
 *   `scripts` and `styles` are reserved and will be overwritten if present.
 * @param {!string} [opts.title = rollup app] - string used for the `<title>` tag in the output html
 * @returns {Function} static site plugin
 */
module.exports = function staticSite({
  dir,
  css = false,
  filename = 'index.html',
  moreScripts = [],
  moreStyles = [],
  suffix = false,
  template: {
    func,
    path,
    data = {},
  } = {},
  title = 'rollup app',
} = {}) {
  const useDefault = !path;
  const useDoT = !func && !!path;

  return {
    name,
    async load(id){
      console.log('load'.red);
      console.log(`  ->[id]:${id}`.yellow);
      return '/* CODEOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO */';
    },
    async buildStart(io){
      console.log('buildStart'.red);
 
    },
    async banner(a,b){
      console.log('banner'.red);
      return 'HELLO WOOOOOOOOORLD'+Date.now(); // will be added to the text
    },
    buildEnd(error){
      console.log('buildEnd'.red);
      error && console.log(String(error).green);
    },
    resolveId(source, importer){
      console.log('resolveId'.red);
      console.log(`  ->[source][${source}]`.yellow);
      console.log(`  ->[importer][${importer}]`.yellow);
      return '';//hello.js';
    },

    async generateBundle(oo, bundle){
      console.log('generateBundle'.red);
      console.log(`  ->options:${JSON.stringify(oo)}`.yellow);
     
      for( const [entry, value] of Object.entries(bundle)){
        //console.log(bundle)
        console.log(`  ${entry}->[type:${value.type}][code:${value.code||value.source}]`.yellow);
      }
      this.emitFile({
        type: 'asset',
        source:'<htm><head></head><body></body></html>',
        //name: 'index.html',
        fileName:'index.html'
      });
    }


    /*async generateBundle({ file }, bundle, isWrite) {
      if (!dir) this.error('`opts.dir` is required!');

      // don't do anything when bundle isn't written
      if (!isWrite) return;

      // figure out paths
      const outputDir = relative(process.cwd(), resolve(dir));
      const relativeOutput = p => relative(outputDir, resolve(p));

      // create template data
      const scripts = forceArray(moreScripts).concat(addSuffix(relativeOutput(file), suffix));

      const styles = forceArray(moreStyles).concat(
        css && addSuffix(relativeOutput(css), suffix)
      )
      .filter(f => f);

      const templateData = {
        title,
        ...data,
        scripts,
        styles,
      };

      let templateFn;
      if (useDefault) {
        templateFn = doT.compile(defaultTemplate);
      } else {
        let userTemplate = await readFile(path, 'utf8').catch(err => this.error(err.toString()));

        if (useDoT) {
          // inject scripts and styles if the user template doesn't handle them
          [
            { arr: scriptsTemplate, hint: `${doT.templateSettings.varname}.scripts`, tag: '</body>' },
            { arr: stylesTemplate, hint: `${doT.templateSettings.varname}.styles`, tag: '</head>' },
          ].forEach(({ arr, hint, tag }) => {
            const matches = userTemplate.match(doT.templateSettings.iterate) || [];
            const shouldSkip = matches.some(str => str.includes(hint));
            if (shouldSkip) return;

            const tagClose = userTemplate.lastIndexOf(tag);
            userTemplate = [
              userTemplate.slice(0, tagClose),
              arr.join(''),
              userTemplate.slice(tagClose, userTemplate.length),
            ].join('');
          });
          templateFn = doT.compile(userTemplate);
        } else {
          templateFn = d => func(userTemplate, d);
        }
      }

      // generate and write html
      const html = `${templateFn(templateData).trim()}\n`;
      const htmlPath = resolve(outputDir, filename);
      await outputFile(htmlPath, html).catch(err => this.error(err.toString()));
    },*/
  };
}
