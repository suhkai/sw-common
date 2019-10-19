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
    dirname,
    parse,
    format
} = require('path');
const htmlRootToFsRoot = require('./htmlRootToFsRoot');
const isObject = require('./isObject');
const favicons = require('favicons');
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
            appName: 'appName',                            // Your application's name. `string`
            appShortName: "appShortName",                       // Your application's short_name. `string`. Optional. If not set, appName will be used
            appDescription: "appDescription",                     // Your application's description. `string`
            developerName: "devName",                      // Your (or your developer's) name. `string`
            developerURL: "devUrl",                       // Your (or your developer's) URL. `string`
            dir: "auto",                              // Primary text direction for name, short_name, and description
            lang: "en-US",                            // Primary language for name and short_name
            background: "#fff",                       // Background colour for flattened icons. `string`
            theme_color: "#fff",                      // Theme color user for example in Android's task switcher. `string`
            appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
            display: "standalone",                    // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
            orientation: "any",                       // Default orientation: "any", "natural", "portrait" or "landscape". `string`
            scope: "/",                               // set of URLs that the browser considers within your app
            start_url: "/?homescreen=1",              // Start URL when launching the application from a device. `string`
            version: "1.0",                           // Your application's version string. `string`
            logging: false,                           // Print logs to console? `boolean`
            pixel_art: false,                         // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
            loadManifestWithCredentials: false,       // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
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
                    path: `${platform}/`
                };
            }
            if (typeof options[platform] === 'string'){
                options[platform] = {
                    path: `${options[platform]}/`
                };
            }
            options[platform].path = htmlRootToFsRoot(options[platform].path || `${platform}/`);
            faviconOptions.path = options[platform].path
            config.html = htmlReplacement;
            all[platform] = favicons(image, faviconOptions);
        }
        // wait for all promises to resolve reject
    }// for all platforms
    return parallelWait(all).then(result => [result, null]);
}

module.exports = faviconProcessing;