console.log(process.env["NODE_PATH"]);
const plugin = require('plugin');
//const rmdirRecursive = require('rmdir-recursive');
const {
    rollup,
    watch
} = require('rollup');

const {
    resolve, join
} = require('path');

// array, can have multiple outputs for single input
const oo = [{
    output: {
        format: 'iife'
    }, 
    dir: join(__dirname,'./dist'),
    banner: '/* banner comment */',
    assetFileNames: '[name]-[hash].[ext]',
    chunkFileNames: '[name]-[hash].js',
    entryFileNames: '[name]-entry-[hash].js'
}];


const io = {
    input: {
        //1:'./lm'
        bundle: require.resolve('./es7.js'),
    },
    plugins: [
        plugin({
            lang: 'de',
            title: 'rollup app',
            base: 'http://www.skyjs.net',
            mmobile: true,
            metas: [{
                    charset: 'UTF-8'
                },
                {
                    name: 'description',
                    content: 'Free Web tutorials'
                },
                {
                    name: 'keywords',
                    content: 'HTML,CSS,XML,JavaScript'
                },
                {
                    name: 'author',
                    content: 'John Doe'
                }
            ],
            links: [{
                href: 'https://fonts.googleapis.com/css?family=Saira+Semi+Condensed&display=swap',
                rel: 'stylesheet'
            }],
            favicon: './someIcon.url'
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