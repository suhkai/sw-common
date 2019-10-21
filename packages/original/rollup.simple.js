const plugin = require('../rollup-plugin-html-advanced');

const rmdirRecursive = require('rmdir-recursive');
const {
    rollup,
    watch
} = require('rollup');

const {
    resolve,
    join
} = require('path');

// array, can have multiple outputs for single input
const oo = [{
    output: {
        format: 'iife'
    },
    dir: join(__dirname, './dist'),
    banner: '/* banner comment */',
    assetFileNames: '[name]-[hash].[ext]',
    chunkFileNames: '[name]-[hash].js',
    entryFileNames: '[name]-entry-[hash].js'
}];


const io = {
    cache: true,
    input: {
        //1:'./lm'
        bundle: './es7.js',
    },
    plugins: [
        plugin({
            favicon: {
                image: './redis.svg',
                platforms: {
                    normative: true,
                    android: true,
                    windows: {
                        path: '/somepath'
                    },
                    firefox: true,
                    yandex: true,
                    appleIcon: true,
                    appleStartup: true,

                }
            },
            lang: 'en',
            base: 'http://jacob-bogers.com',
            title: 'rollup.js test app',
            mobile: true,
            appId: 'myApp',
            meta: [],
            link: [],
            script: [],
            excludeChunks: a => {
                if (a.type==='chunk' && a.name === 'bundle') { 
                    return true; 
                }
                console.log(a)
            },
            name: 'index.html'

        })
    ]
};


async function build() {
    // clean out dist directory
    const t1 = new Date();
    //rmdirRecursive('./dist');
    const bundle = await rollup(io);
    console.log('rollup part 1 finished'.cyan);
    // what methods and props does the bundle object have

    console.log(Object.keys(bundle));
    for (let i = 0; i < oo.length; i++) {
        const o = oo[i];
        /*const {
            output
        } = await bundle.generate(o);
        /*console.log(output);*/
        await bundle.write(o);
    }
}
build();