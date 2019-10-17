
const {
  join
} = require('path');

//
const clone = require('clone');

const isObject = require('./isObject');
// test favicons processing
const processFavicons = require('./favicon-processing');
const htmlRootToFsRoot = require('./htmlRootToFsRoot');
//
// for debugging
//
require('colors');

const isBuffer = Buffer.isBuffer;


module.exports = function htmlGenerator(op = {}) {
  // validate plugin-options
  const fullPluginName = 'rollup-plugin-html-advanced';
  if (!isObject(op)) {
    throw new Error(`plugin "${fullPluginName}" was not passed an JS Object as "option"`);
  }

  const o = clone(op);

  const options = Object.create(null);
  options.lang = o.lang || 'en'
  options.base = o.base || undefined;
  options.title = o.tile || 'rollup.js app';
  options.metas = o.metas;
  options.links = o.links;
  options.mobile = o.mobile || true;
  options.favicon = o.favicon;



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
      throw new Error(`${fullPluginName}: "options.favicon.image" must be a string or a Buffer object`);
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
      throw new Error(`${fullPluginName}: no valid platforms specified in "options.favicon.platform"`);
    }
  }
  //
  options.name = o.name || 'index.html'

  return {
    name: fullPluginName,
    // this is basicly the only hook we need
    async generateBundle(oo, bundle, isWrite) {
      // generate favicons
      if (options.favicon) {
        const image = options.favicon.image;
        const platforms = options.favicon.platforms;
        for (const [platformName, platformObj] of Object.entries(platforms)) {
          if (platformObj === true) {
            platforms[platformName] = {
              path: `/${platformName}`
            };
            continue;
          }
          if (typeof platformObj === 'string') {
            platforms[platformName] = {
              path: `/${platformObj}`
            };
            continue;
          }
          if (!isObject(platformObj)) {
            platforms[platformName] = false; // clear it
            this.warn(`icons for ${platformName} will not be generated, wrong configuration object for this platforl`);
          }
          if (platformObj['path'] === undefined) {
            platforms[platformName] = false; // clear it
            this.warn(`icons for favicon.${platformName} will not be generatoed, please specify an "path" property in the favicon.${platformName}.path property`);
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
          this.warn(`assets for favicon platform [${name}] was not generated, warning: ${String(warning)}`);
        }
        for (const [platformName, assetClasses] of Object.entries(resolved)) {
          //files
          for (const file of assetClasses.files) {
            const filePath = platformName === 'favicons' ? platforms.normative.path : platforms[platformName].path;
            this.emitFile({
              fileName: htmlRootToFsRoot(join(filePath, file.name)),
              source: file.contents,
              type: 'asset'
            });
          }
          //html
          for (const snip of assetClasses.html) {
            console.log(snip);
          }
          for (const image of assetClasses.images) {
            const filePath = platformName === 'favicons' ? platforms.normative.path : platforms[platformName].path;
            this.emitFile({
              fileName: htmlRootToFsRoot(join(filePath, image.name)),
              source: image.contents,
              type: 'asset'
            });
          }
        }
      }
    }
  };
}