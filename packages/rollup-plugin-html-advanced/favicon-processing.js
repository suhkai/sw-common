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

/*
{
  android :{ // existance of android structure means you wat android
      manifest: true/false
  }

  android: true // everything possible for this

}
*/
const {
    relative,
    resolve,
    dirname
} = require('path');


const isObject = require('./isObject');
const constants = require('./constants');
const isPositiveInteger = require('./isPositiveInteger');
const favicons = require('../favicons');
const config = favicons.config;
const html = require('./favicon-html');

/*
 android,
    windows,
    favicons,
    coast,
    appleStartup,
    manifest: {
        appleStartup: appleStartup,
        windows: windowManifest,
        android: androidManifest,
        yandex:yandexManifest
    }
*/

config.files = {};

const dummyHTML = () => ({
    tag: 'dummy'
});

function getName(file) {
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

async function faviconProcessing(options = {}) {
    const errors = [];
    const o = {
        android: 0, //0= skip, 1 = icons + html (non manifest), 2 = icons+html+manifest
        windows: 0,
        appleIcon: 0,
        appleStartup: 0,
        coast: 0,
        favicons: 0,
        firefox: 0,
        yandex: 0
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
            if (!isPositiveInteger(value)) {
                errors.push(`"${key}" config option MUST BE an integer value >= 0`);
                return;
            }
            if (options[key] > 7) {
                errors.push(`"${key} config option MUST be a valid bit mask <= 7, it is: ${options[key]}`);
                return;
            }
            // key is valid
            return;
        }
        nonConfigured++;
    });
    // we had errors?
    if (errors.length) {
        return [null, errors];
    }
    // did we configure anything?
    if (nonConfigured === allProps.length) {
        return [null, null]; // no errors , no data
    }
    // did we specifiy an image?
    if (!options.image || (typeof options.image !== 'string' && !Buffer.isBuffer(options.image))) {
        return [null, `favicon "image" must be a path to a local image file or a Buffer object`];
    }
    const image = getName(options.image);
    // turn everything off by default

    const all = {};
    for (const platform of allProps) {
        if (!(platform in options)) {
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
        if (options.android & (constants.ICON || constants.HTML)) {
            faviconOptions.icons.android = true;
            htmlReplacement.android = html.android;
        }
        if (options.android & constants.MANIFEST) {
            htmlReplacement.android.push(html.manifest.android); // generate extra html tag for manifest
        }
        try {
            config.html = htmlReplacement;
            const result = await favicons(image, faviconOptions);
            all[platform] = result;
        } catch (err) {
            all[platform].error = err;
        }
    }
    return [all, null];
}

module.exports = faviconProcessing;