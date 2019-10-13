// prettier-ignore
const relmanifest = {
    name: 'rel',
    value: "manifest"
};
const href = src => ({
    name: 'href',
    value: src
});
const crossOrigin = {
    name: 'crossorigin',
    value: 'use-credentials'
};
const rel = value => ({
    name: 'rel',
    value
});

const entry = (name, value) => ({
    name,
    value
});

const appleTouchIcon = entry('rel', 'applie-touch-icon');

const sizes = size => entry('sizes', `${size}x${size}`);

const hrefAppleTouch = (rel, value) => href(rel(`apple-touch-icon-${value}x${value}.png`))

function androidManifest({
    relative,
    loadManifestWithCredentials
}) {
    const rc = {
        tag: 'link',
        attrs: [relmanifest, href(`${relative('manifest.json')}`)]
    };
    if (loadManifestWithCredentials) {
        rc.attrs.push(crossOrigin);
    }
    return rc;
};

function windowManifest({
    relative
}) {
    return {
        tag: 'meta',
        attrs: [
            entry('name', 'msapplication-config'),
            entry('content', `${relative("browserconfig.xml")}`)
        ]
    };
}

function yandexManifest({
    relative
}) {
    return {
        tag: 'link',
        attrs: [
            rel('yandex-tableau-widget'),
            href(`${relative("yandex-browser-manifest.json")}`)
        ]
    };
}

const android = [
    () => ({
        tag: 'meta',
        attrs: [entry('name', 'mobile-web-app-capable'), entry('content', 'yes')]
    }),
    ({
        theme_color,
        background
    }) => ({
        tag: 'meta',
        attrs: [entry('name', 'theme-color'), entry('content', `${theme_color || background}`)]
    }),
    ({
        appName
    }) => {
        if (appName) {
            return {
                tag: 'meta',
                attrs: [entry('name', 'application-name'), entry('content', appName)]
            };
        }
        return {
            tag: 'meta',
            attrs: [entry('name', 'application-name')]
        };
    }
];

const appleIcon = [
    ...[57, 60, 72, 76, 114, 120, 144, 152, 167, 180, 1024].map(size => function ({
        relative
    }) {
        return {
            tag: 'link',
            attrs: [appleTouchIcon, sizes(size), hrefAppleTouch(relative, size)]
        };
    }),
    () => ({
        tag: 'meta',
        attrs: [entry('name', 'apple-mobile-web-app-capable'), entry('content', 'yes')]
    }),
    ({
        appleStatusBarStyle
    }) => ({
        tag: 'meta',
        attrs: [entry('name', 'apple-mobile-web-app-status-bar-style'), entry('content', `${appleStatusBarStyle}`)]
    }),
    ({
        appName
    }) => {
        const rc = {
            tag: 'link',
            attrs: [entry('name', 'apple-mobile-web-app-title')]
        };
        appName && rc.attrs.push(entry('content', appName));
        return rc;
    },
];

const appleStartup = [
    ...[{
            w: 320,
            h: 480,
            r: 1,
            d: {
                w: 320,
                h: 460
            }
        },
        {
            w: 320,
            h: 480,
            r: 2,
            d: {
                w: 640,
                h: 920
            }
        },
        {
            w: 320,
            h: 568,
            r: 2,
            d: {
                w: 640,
                h: 1096
            }
        },
        {
            w: 375,
            h: 667,
            r: 2,
            d: {
                w: 750,
                h: 1294
            }
        }
    ].map(o => ({
        relative
    }) => ({
        tag: 'link',
        attrs: [
            rel('apple-touch-startup-image'),
            entry('media', `(device-width: ${o.w}px) and (device-height: ${o.h}px) and (-webkit-device-pixel-ratio: ${o.r})`),
            href(`apple-touch-startup-image-${o.d.w}x${o.d.h}.png`)
        ]
    })),
    ...[{
            ls: 1,
            w: 414,
            h: 736,
            r: 3,
            d: {
                w: 1182,
                h: 2208
            }
        },
        {
            ls: 0,
            w: 414,
            h: 736,
            r: 3,
            d: {
                w: 1242,
                h: 2148
            }
        },
        {
            ls: 1,
            w: 768,
            h: 1024,
            r: 1,
            d: {
                w: 748,
                h: 1024
            }
        },
        {
            ls: 0,
            w: 768,
            h: 1024,
            r: 1,
            d: {
                w: 768,
                h: 1004
            }
        },
        {
            ls: 1,
            w: 768,
            h: 1024,
            r: 2,
            d: {
                w: 1496,
                h: 2048
            }
        },
        {
            ls: 0,
            w: 768,
            h: 1024,
            r: 2,
            d: {
                w: 1536,
                h: 2008
            }
        }
    ].map(o => ({
        relative
    }) => ({
        tag: 'link',
        attrs: [
            rel('apple-touch-startup-image'),
            entry('media', `(device-width: ${o.w}px) and (device-height: ${o.h}px) and (orientation: ${o.ls ? 'landscape' : 'portrait'}) and (-webkit-device-pixel-ratio: ${o.r})`),
            href(`apple-touch-startup-image-${o.d.w}x${o.d.h}.png`)
        ]
    })),
];

const coast = [
    ({
        relative
    }) => ({
        tag: 'link',
        attrs: [
            rel('icon'),
            entry('type', 'image/png'),
            sizes(228),
            href(`${relative('coast-228x228.png')}`)
        ]
    })
];

const favicons = [
    ({
        relative
    }) => ({
        tag: 'link',
        attrs: [
            rel('shortcut icon'),
            href(`${relative('favicon.ico')}`)
        ]
    }),
    ...[16, 32].map(size =>
        ({
            relative
        }) => ({
            tag: 'link',
            attrs: [
                rel('icon'),
                entry('image/png'),
                sizes(size),
                href(`${relative(`favicon-${size}x${size}.png`)}`)
            ]
        }))
];

const windows = [
    ({
        background
    }) => ({
        tag: 'meta',
        attrs: [
            entry('name', 'msapplication-TileColor'),
            entry('content', `${background}`)
        ]
    }),
    ({
        relative
    }) => ({
        tag: 'meta',
        attrs: [
            entry('name', 'msapplication-TileImage'),
            entry('content', `${relative('mstile-144x144.png')}`)
        ]
    }),

]



module.exports = {
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
}