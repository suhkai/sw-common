// 
const {
  join,
  normalize,
  parse,
  format,
  extname
} = require('path');
// 
const clone = require('clone');
// 
const isObject = require('./utils/isObject');
// test favicons processing
const processFavicons = require('./favicons/favicon-processing');
const htmlRootToFsRoot = require('./utils/stripAbsolutePath');
// 
const {
  htmlProcessing,
  convertOptionTagsToP5,
  createElement,
  createComment,
  serialize
} = require('./html/html-processing');

const pick = require('./utils/pick');
// 
// for debugging
// 
require('colors');
//
const isBuffer = Buffer.isBuffer;
//
const platformOptions = {
  android: {
    loadManifestWithCredentials: false, // meta tag in the "head"
    // manifest properties
    appName: true, // manditory
    theme_color: true, // manditory
    background: true,
    background_color: 'something', // doesnt work, see "background"
    short_name: true, //copy from "name",
    desription: true,
    dir: "auto", // text-direction
    lang: "en-US", // default
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff"
  },
  appleIcon: {
    appName: true,
    appleStatusBarStyle: true
  },
  windows: {
    background: true
  }
};

const fullPluginName = 'rollup-plugin-html-advanced';

function formatMsg(text) {
  return `plugin [${fullPluginName}]: ${text}`;
}

function injectAssets(inject, excludeChunks, excludeAssets, bundle, head, body, logger) {
  for (const key in bundle) {
    const fileName = htmlRootToFsRoot(key);
    const ext = extname(fileName);
    // I am only interested in css and js plugins
    if (!['.js', '.css'].includes(ext)) {
      continue;
    }
    // js source files
    let addSource = true;
    if (ext === '.js' && excludeChunks) {
      // create representation of the chunk
      const chunkRep = pick(bundle[key], 'name', 'type', 'modules', 'isEntry', 'fileName', 'faceModuleId');
      addSource = !(excludeChunks(chunkRep) === true);
    }
    if (addSource) {
      const scriptTag = createElement('script', [{
        name: 'src',
        value: fileName
      }]);
      if (inject === 'body' || inject === true) {
        body.childNodes[body.childNodes.length] = scriptTag;
      }
      else if (inject === 'head') {
        head.childNodes[head.childNodes.length] = scriptTag;
      }
      else {
        const errMsg = format(`unreachable code`);
        logger.error(errMsg);
        // unreachable code, it will stop here
      }
    }
    // css files
    let addCss = true;
    if (ext === '.css' && excludeAssets) {
      const assetRep = pick(bundle[key], 'fileName', 'isAsset', 'type', 'source');
      addCss = !(excludeAssets(assetReps) === true);
    }
    if (addCss) {
      const cssTag = createElement('link', [
        {
          name: 'href',
          value: fileName
        },
        {
          name: 'rel',
          value: 'stylesheet'
        }
      ]);
      head.childNodes[head.childNodes.length] = cssTag;
    }
    else {
      const errMsg = format(`unreachable code`);
      logger.error(errMsg);
      // unreachable code, it will stop here
    }
  }
}

module.exports = function htmlGenerator(op = {}) {
 
  const rc = {
    name: fullPluginName,
    // not async
    options: function(io){ //  but we cannot use this.error (to bail in this hook), transofrm options here
      console.log(io)
      return io;
    },
    outputOptions(oo){ // optionally transfer output options here, maybe correct them? filename dest a/b/c/d/e
      // no need for root stuff
      console.log('outputOptions',oo);
      // this works, nice this.error('stop');
    },
    buildStart: async function(io){ 
      // here is where it all matters
      // this.error(` build has to stop`, this);
      console.log('build-start', io);
    },
    // this is basicly the only hook we need
    // exclude 
    /**
     * 
     * @param {*} oo 
     * @param {*} bundle 
     * @param {*} isWrite 
     * chunk
     * {
     *    [fileName: string] :{
     *         code: // -> actual source code
     *         dynamicImports: []
     *         exports: [] // makes sense for libraries
     *         facadeModuleId: ....es7.js
     *         fileName: 'bundle-entry-2c65ad77.js'
     *         imports: [] // no imports depends on the kinds o bundle format (cjs,will have them) 
     *         isDynamicEntry: false
     *         isEntry: true,
     *         map: (its not transpiled or babilified)
     *         modules: { 
     *             [full path]: {...}
     *             [full path]: {...}
     *         }
     *         name: 'bundle' <- entry in the input options
     *         type: 'chunk' or asset <- what kind
     *   }
     * 
     *   // name, type, modules, isEntry, fileName, faceModuleId

     * 
     * }
     * // [fileName: string]: {
     *      fileName: //->full file name
     *      isAsset: true
     *      type: "asset"
     *      source: Buffer|String (binary data or string.)
     * }    
     * 
     * so "exclusion" needs a function 
     */
    async generateBundle(oo, bundle, isWrite) {

      const logger = {
        error: this.error,
        warn: this.warn
      };

      if (!isObject(op)) {
        const errMsg = formatMsg('was not passed an JS Object as "option"');
        throw new Error(errMsg);
      }

      const o = clone(op);

      const options = Object.create(null);
      options.lang = o.lang || 'en'
      options.base = o.base;
      options.title = o.title || 'rollup.js app';
      options.mobile = o.mobile || true;
      options.favicon = o.favicon;
      options.appId = o.appId;
      // excludeChunks
      if (o.excludeChunks !== undefined) {
        if (typeof o.excludeChunks === 'function') {
          options.excludeChunks = o.excludeChunks;
        }
        else {
          const errMsg = formatMsg(`"excludeChunks" is not a funciton`);
          throw new Error(`plugin "${fullPluginName}"`)
        }
      }
      // excludeAssets
      if (o.excludeAssets !== undefined) {
        if (typeof o.excludeAssets === 'function') {
          options.excludeAssets = o.excludeAssets;
        }
        else {
          const errMsg = formatMsg(`"excludeAssets" is not a funciton`);
          throw new Error(`plugin "${fullPluginName}"`)
        }
      }
      // inject
      if (options.inject !== undefined) {
        if (options.inject === true || options.inject === 'body') {
          o.inject = 'body';
        }
        else if (options.inject === 'head' || options.inject === false) {
          o.inject = options.inject;
        }
        else {
          const errMsg = formatMsg(`"inject" should be 'head'|'body'|true|false`);
          throw new Error(`plugin "${fullPluginName}"`)
        }
      }
      options.inject = true;
      options.meta = o.meta || [];
      // https://github.com/jantimon/html-webpack-plugin#options

      options.link = o.link || [];
      options.script = o.script || [];
      options.filename = o.filename || 'index.html';

      // !logger, !title, !base, !meta, !link, !scripts, !appId
      if (typeof options.lang !== 'string') {
        logger.error('options.lang is not a string');
      }
      if (typeof options.title !== 'string') {
        logger.error('options.title is not a string');
      }
      if (typeof options.appId !== 'string') {
        logger.error('options.appId is not a string');
      }
      if (typeof options.mobile !== 'boolean') {
        logger.error('options.mobile is not a boolean')
      }
      if (typeof options.filename !== 'string') {
        logger.error('options.filename is not a string')
      }
      if (!Array.isArray(options.meta)) {
        logger.error('options.meta is not an array');
      }
      if (!Array.isArray(options.link)) {
        logger.error('options.link is not an array');
      }
      if (!Array.isArray(options.script)) {
        logger.error('options.script is not an array');
      }

      // meta tags general section
      options.meta = convertOptionTagsToP5('meta', options.meta);

      if (options.mobile === true) {
        options.meta.push(createElement('meta', [{
          name: 'content',
          value: 'width=device-width, initial-scale=1'
        }, {
          name: 'name',
          value: 'viewport'
        }]));
      }
      options.meta.unshift(createComment('general meta section'));

      // link tags general section
      options.link = convertOptionTagsToP5('link', options.link);
      if (options.link.length) {
        options.link.unshift(createComment('general link section'));
      }

      // transform script tags
      options.script = convertOptionTagsToP5('script', options.script);


      // correct favicon

      if (typeof o.favicon === 'string' || isBuffer(o.favicon)) {
        options.favicon = {
          image: o.favicon,
          platforms: {
            normative: {
              path: '/normative'
            }
          }
        }
      }

      if (isObject(options.favicon)) {
        // do we have an image?
        if (typeof options.favicon.image !== 'string' && !isBuffer(options.favicon.image)) {
          const errMsg = formatMsg('"options.favicon.image" must be a string or a Buffer object');
          throw new Error(errMsgà);
        }
        // any keys on platform
        options.favicon.platforms = options.favicon.platforms || {
          normative: {
            path: '/normative'
          }
        };
        if (!isObject(options.favicon.platforms)) {
          throw new Error(`${fullPluginName}: "options.favicon.platform"`);
        }
        // there must at least me one prop that NOT false or an empty string
        let validPlatform = false;
        for (const value of Object.values(options.favicon.platforms)) {
          if (value === true || (typeof value === 'string' && value.length > 0)) {
            validPlatform = true;
            break;
          }
          if (isObject(value) && typeof value.path === 'string' && value.path.length > 0) {
            validPlatform = true;
            break;
          }
        }
        if (!validPlatform) {
          const errMsg = formatMsg('no valid platforms specified in "options.favicon.platform"');
          throw new Error(errMsg);
        }
      }
      //

      // generate favicons
      if (options.favicon) {
        const image = options.favicon.image;
        const platforms = options.favicon.platforms;
        for (const [platformName, platformObj] of Object.entries(platforms)) {
          if (platformObj === true) {
            platforms[platformName] = {
              path: `${platformName}`
            };
            continue;
          }
          if (typeof platformObj === 'string') {
            platforms[platformName] = {
              path: `${platformObj}`
            };
            continue;
          }
          if (!isObject(platformObj)) {
            platforms[platformName] = false; // clear it
            const warnMsg = formatMsg(`icons for ${platformName} will not be generated, wrong configuration object for this platforl`);
            this.warn(warnMsg);
          }
          if (platformObj['path'] === undefined) {
            platforms[platformName] = false; // clear it
            const warnMsg = formatMsg(`icons for favicon.${platformName} will not be generatoed, please specify an "path" property in the favicon.${platformName}.path property`);
            this.warn(warnMsg);
          }
        }
        const [answer, error] = await processFavicons({
          favicons: platforms.normative,
          android: platforms.android,
          windows: platforms.windows,
          appleIcon: platforms.appleIcon,
          appleStartup: platforms.appleStartup,
          coast: platforms.coast,
          firefox: platforms.firefox,
          yandex: platforms.yandex,
          image
        });
        if (error) {
          this.error(`favicon generation error: ${String(error)}`);
        }
        const {
          resolved,
          rejected
        } = answer;
        for (const [name, warning] of Object.entries(rejected)) {
          const warnMsg = formatMsg(`assets for favicon platform [${name}] was not generated, warning: ${String(warning)}`);
          this.warn(warnMsg);
        }

        for (const [platformName, assetClasses] of Object.entries(resolved)) {
          //files
          for (const file of assetClasses.files) {
            const filePath = platformName === 'favicons' ? platforms.normative.path : platforms[platformName].path;
            this.emitFile({
              fileName: htmlRootToFsRoot(normalize(join(filePath, file.name))),
              source: file.contents,
              type: 'asset'
            });
          }
          //html
          const demark = {
            meta: false,
            link: false
          };
          for (const snip of assetClasses.html) {
            if (!['meta', 'link'].includes(snip.tag)) {
              this.warn(`incorrect html snippet generated: [${snip && snip.tag}]`)
              continue;
            }
            const htmlSnip = createElement(snip.tag, snip.attrs);
            demark[snip.tag] || options[snip.tag].push(createComment(`${platformName} section`));
            demark[snip.tag] = true;
            options[snip.tag].push(htmlSnip);
          }
          //images
          for (const image of assetClasses.images) {
            const filePath = platformName === 'favicons' ? platforms.normative.path : platforms[platformName].path;
            this.emitFile({
              fileName: htmlRootToFsRoot(join(filePath, image.name)),
              source: image.contents,
              type: 'asset'
            });
          }
        } // for
      } // if favicons
      // generate final html
      const [html, head, body, doc] = htmlProcessing(
        logger,
        options.title,
        options.base,
        options.meta,
        options.link,
        options.script,
        options.appId,
        options.lang,
        options.inject
      );
      options.inject && injectAssets(options.inject, options.excludeChunks, options.excludeAssets, bundle, head, body, logger);
      // emit index.html
      this.emitFile({
        fileName: options.filename,
        source: serialize(doc),
        type: 'asset'
      });
    }
  };
  return rc;
}
