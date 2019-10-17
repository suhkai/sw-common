'use strict';

/*
| platform     | manifest | icons | manifest-html | non-manifest-html |
| ------------ | -------- | ----- | ------------- | ----------------- |
| android      | yes      | yes   | yes           | yes               |
| windows      | yes      | yes   | yes           | yes               |
| appleIcon    | no       | yes   | no            | yes               |
| appleStartup | no       | yes   | yes           | yes               |
| coast        | no       | yes   | yes           | yes               |
| favicons     | no       | yes   | no            | yes               |
| firefox (OS) | yes      | yes   | no            | no                |
| yandex       | yes      | yes   | yes           | no                |
*/

const {
    resolve,
    dirname
} = require('path');

const isObject = require('./isObject');
const constants = require('./constants');
const isPositiveInteger = require('./isPositiveInteger');
const favicons = require('../favicons');
const config = favicons.config;
const html = require('./favicon-html');

const parallelWait = require('./parallelWait');

function getName(file) {
    if (Buffer.isBuffer(file)) {
        return file;
    }
    if (typeof file !== 'string') {
        return false;
    }
    if (file[0] === '/') { // from root
        return file;
    }
    const _dir = dirname(require.main.filename || __dirname);
    const fullPath = resolve(_dir, file);
    return fullPath;
}

function faviconProcessing(options = {}) {
    const errors = [];
    const o = {
        android: false, //0= skip, 1 = icons + html (non manifest), 2 = icons+html+manifest
        windows: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: false,
        firefox: false,
        yandex: false
    };
    if (!isObject(options)) {
        return [null, `Illegal Argument: not a valid object ${options}`]
    }
    //check
    let nonConfigured = 0;
    const allProps = Object.keys(o);
    allProps.forEach(key => {
        if (key in options) {
            const value = options[key];
            if (!Object(value) && typeof value !== 'boolean') {
                errors.push(`"${key}" config option MUST BE an Object or a boolean`);
                return;
            }
            // key is valid
            return;
        }
        nonConfigured++;
    });
    // we had errors?
    if (errors.length) {
        return Promise.resolve([null, errors.join('|')]);
    }
    // did we configure anything?
    if (nonConfigured === allProps.length) {
        return Promise.resolve([null, null]); // no errors , no data
    }
    // did we specifiy an image?
    if (!options.image || (typeof options.image !== 'string' && !Buffer.isBuffer(options.image))) {
        return Promise.resolve([null, `favicon "image" must be a path to a local image file or a Buffer object`]);
    }
    const image = getName(options.image);
    // turn everything off by default

    const all = {};
    for (const platform of allProps) {
        if (!(platform in options && options[platform])) {
            continue;
        }
        const faviconOptions = {
            icons: {
                android: false, //0= skip, 1 = icons + html (non manifest), 2 = icons+html+manifest
                windows: false,
                appleIcon: false,
                appleStartup: false,
                coast: false,
                favicons: false,
                firefox: false,
                yandex: false
            }
        };
        const htmlReplacement = {};
        // process android
        if (options[platform]) {
            faviconOptions.icons[platform] = true;
            htmlReplacement[platform] = html[platform];
            if (typeof options[platform] === 'boolean') {
                options[platform] = {
                    path: `/${platform}/`
                };
            }
            if (typeof options[platform] === 'string'){
                options[platform] = {
                    path: `/${options[platform]}/`
                };
            }
            options[platform].path = options[platform].path || `/${platform}/`;
            faviconOptions.path = options[platform].path
            config.html = htmlReplacement;
            all[platform] = favicons(image, faviconOptions);
        }
        // wait for all promises to resolve reject
    }
    return parallelWait(all).then(result => [result, null]);
}

module.exports = faviconProcessing;