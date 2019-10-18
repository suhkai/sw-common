// 
const {
  join
} = require('path');
// 
const clone = require('clone');
//
const isObject = require('./isObject');
// test favicons processing
const processFavicons = require('./favicon-processing');
const htmlRootToFsRoot = require('./htmlRootToFsRoot');
const {
  htmlProcessing,
  convertOptionTagsToP5,
  createElement,
  serialize
} = require('./html-processing');
// 
// for debugging
// 
require('colors');
//
const isBuffer = Buffer.isBuffer;
//
module.exports = function htmlGenerator(op = {}) {
  // validate plugin-options
  
  const fullPluginName = 'rollup-plugin-html-advanced';
  if (!isObject(op)) {
    throw new Error(`plugin "${fullPluginName}" was not passed an JS Object as "option"`);
  }

  const o = clone(op);

  const options = Object.create(null);
  options.lang = o.lang || 'en'
  options.base = o.base;
  options.title = o.title || 'rollup.js app';
  options.mobile = o.mobile || true;
  options.favicon = o.favicon;
  options.appId = o.appId

  options.meta = o.meta || [];
  options.link = o.link || [];
  options.script = o.script || [];
  options.name = o.name || 'index.html';

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
  if (typeof options.mombile !== 'boolean') {
    logger.error('options.mobile is not a boolean')
  }
  if (typeof options.name !== 'string') {
    logger.error('options.name is not a string')
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

  // transform meta tags
  options.meta = convertOptionTagsToP5('meta', options.meta);
  // transform link tags
  options.links = convertOptionTagsToP5('link', options.meta);
  // transform script tags
  options.script = convertOptionTagsToP5('script', options.script);
  
  // optional mobile
  if (options.mobile === 'true') {
    options.meta.push(createElement('meta', [{
      name: 'content',
      value: 'width=device-width, initial-scale=1'
    }, {
      name: 'name',
      value: 'viewport'
    }]));
  }

  // optional title
  if (options.title) {
    options.meta.push(createElement('title', [{
      name: 'content',
      value: 'width=device-width, initial-scale=1'
    }, {
      name: 'name',
      value: 'viewport'
    }]));
  }


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

  return {
    name: fullPluginName,
    // this is basicly the only hook we need
    async generateBundle(oo, bundle, isWrite) {
      
      const logger = {
        error: this.error,
        warn: this.warn
      };
      
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
            meta.push(snip); // already in parse5 format!
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
          // generate final html
          const [ html, head, body, doc ] = htmlProcessing(logger, title, base, meta, link, scripts, appId, lang);
          // TODO: add sources to the body end
          const htmlSource = serialize(doc);
          
          // emit final html
          this.emitFile({
            type:'asset',
            source: asset,
            name: options.name
          });
        }
      }
    }
  };
}