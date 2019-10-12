console.log(process.env["NODE_PATH"]);
const favicons = require('../favicons');
const config = favicons.config;

const oldHtml = favicons.config.html;
favicons.config.html = require('./favicon-html');

const source = 'test/turkey.png';


const config2 = {
    path: '/favicons',
    appName: null,
    appShortName: null,
    appDescription: null,
    developerName: null,
    developerURL: null,
    dir: 'auto',
    lang: 'en-US',
    background: '#fff',
    theme_color: '#fff',
    appleStatusBarStyle: 'black-translucent',
    display: 'standalone',
    orientation: 'any',
    start_url: '/?homescreen=1',
    version: '1.0',
    logging: false,
    pipeHTML: false,
    pixel_art: false,
    loadManifestWithCredentials: false,
    manifestRelativePaths: false,
    icons: {
        android: true,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: false,
        firefox: false,
        windows: false,
        yandex: false
    }
}

async function processFav() {
    const result = await favicons(source, config2);
    console.log(JSON.stringify(Object.keys(result)).red);
    const { images, files, html } = result;
    for (const image of images.map(m => m.name).sort()) {
        console.log(image);
    }
    //console.log(images),
    console.log('------------------');
    console.log(files);
    console.log('------------------');
    for (const snippet of html) {
        console.log(snippet);
    }
}

processFav();



