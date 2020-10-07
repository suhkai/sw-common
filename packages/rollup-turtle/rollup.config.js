module.exports = [
    {
        input: 'src/index.js',
        output: [
            {
                file: 'dist/bundle-cjs.js',
                format: 'cjs',
                exports: 'named'
            },
            {
                file: 'dist/bundle-es.js',
                format: 'es'
            },
            
            {
                file: 'dist/bundle-iife.js',
                format: 'iife',
                name:'iffe_test'
            },
            {
                file: 'dist/bundle-system.js',
                format: 'system'
            },
            {
                file: 'dist/bundle-amd.js',
                format: 'amd'
            },
            {
                file: 'dist/bundle-umd.js',
                format: 'umd',
                name:'test'
            }
      ]   
    }
];