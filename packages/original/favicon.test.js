const favicons = require('favicons');
const source = 'test/turkey.png';


const config2 = {
    path: '/',
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
        appleIcon: true,
        appleStartup: true,
        coast: true,
        favicons: true,
        firefox: true,
        windows: true,
        yandex: true
    }
}

const configuration = {
    path: 'favicons/',
    appName: 'my wonderfull app',
    appShortName: 'wonder',
    display: 'standalone',
    start_url: '/?homescreen=1',
    html: 'index.html',
    background: 'white',                       // Background colour for flattened icons. `string`
    theme_color: 'red',
    version: '10',
    api_version: 'hello',
    //theme_color: '',
    //replace: true,
    icons: {
        android: false,  // manifest // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        appleIcon: false,            // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        appleStartup: false,         // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        coast: false,                // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        favicons: true,              // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        firefox: false,              // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        windows: true,               // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        yandex: true                 // 
    }
};

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

