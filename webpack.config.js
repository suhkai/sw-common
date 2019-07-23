const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { resolve } = require('path');

module.exports = function () {
    const id = Math.round(Math.random() * 1000);

    const rc0 = {
        resolve: {
            //default ['.wasm', '.mjs', '.js', '.json']
            extensions: ['.wasm', '.mjs', '.js', '.json', '.ts', '.tsx', '.css']
        },
        devtool: 'source-map',
        optimization: {
            sideEffects: true, // respect the sideEffects flag in package.json
            flagIncludedChunks: true,
            mergeDuplicateChunks: true,
            removeEmptyChunks: true,
            removeAvailableModules: true,
            // optimization.nodeEnv: '..', uses DefinePlugin to set process.env.NODE_ENV
            chunkIds: 'named',
            moduleIds: 'hashed',
            splitChunks: {
                chunks: 'all'
            },
            namedModules: true, //named modules for better debugging
            runtimeChunk: 'single',// { name: entrypoint => `runtime~${entrypoint.name}` }
            //runtimeChunk: {	name: (entrypoint) => ['runtime-sw-notice','sw-notice'].includes(entrypoint.name)  ? false :`runtime~${entrypoint.name}`
        },
        mode: 'development',
        entry: {
            'sw-notice': './src/sw.ts'
        },
        output: {
            globalObject: 'this'
        },
        module: {
            rules: [
                {
                    test: /\.(m|j|t)s$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "@babel/env",
                                "@babel/preset-typescript"
                            ],
                            plugins: [
                                "@babel/proposal-class-properties",
                                "@babel/proposal-object-rest-spread"
                            ]
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }]
                },
            ]
        },
        plugins: [
            //new MyExampleWebpackPlugin(),
            new ManifestPlugin({}),
            new BundleAnalyzerPlugin({
                analyzerMode: 'none'
            }),
            new CleanWebpackPlugin({
                verbose: true,
                dry: false
            }),
        ]
    };
    return [rc0];
};