const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');

const {
    resolve
} = require('path');

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
            minimize: true,
            // optimization.nodeEnv: '..', uses DefinePlugin to set process.env.NODE_ENV
            chunkIds: 'named',
            moduleIds: 'hashed',
            splitChunks: {
                chunks(chunk) {
                    // exclude `sw-notice`
                    return !['sw-notice'].includes(chunk.name);
                }
            },
            namedModules: true, //named modules for better debugging
            runtimeChunk: false, // { name: entrypoint => `runtime~${entrypoint.name}` }
            //runtimeChunk: {	
            //    name: (entrypoint) => ['runtime-sw-notice','sw-notice'].includes(entrypoint.name)  ? 9 :`runtime~${entrypoint.name}`
            //}
        },
        mode: 'development',
        entry: {
            'sw-notice': './src/sw.ts',
            'primer': './src/primer.ts'
        },
        output: {
            globalObject: 'this'
        },
        module: {
            rules: [{
                test: /\.(m|j|t)s$/,
                exclude: /node_modules/,
                use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ["@babel/env", {
                                    "useBuiltIns": "usage",
                                    "corejs": {
                                        version: 3,
                                        proposals: true
                                    }
                                }],
                                "@babel/preset-typescript"
                            ],
                            plugins: [
                                "@babel/proposal-class-properties",
                                "@babel/proposal-object-rest-spread",
                                "@babel/plugin-transform-async-to-generator"
                            ]
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            }, ]
        },
        plugins: [
            //new MyExampleWebpackPlugin(),
            new ManifestPlugin({}),
            new BundleAnalyzerPlugin({
                analyzerMode: 'none'
            }),
            new HtmlWebPackPlugin({
                //title: '📖 👨‍🎓 benchmark',
                /* overrided by the template login , look below, when not using 
                		 webpackHTMLtemplateplgin ->meta: {  viewport: "width=device-width, initial-scale=1, shrink-to-fit=no" },
                */
                appMountHtmlSnippet: '<div id="app-spinner"></div>',
                excludeChunks: ['sw-notice', 'runtime-sw-notice'],
                hash: true,
                showErrors: true,
                xhtml: true,
                //template configuration
                template: require('html-webpack-template'),
                inject: false, //inject assets into the given template  = false (template has own logic, leave it alone)
                /*appMountHtmlSnippet: `<div id="custom-insertion-point">
				This might be any DOM node of your choice which can serve as an insertion point.
			  </div>`,*/
                appMountId: 'app', // create a <div id="app"></div> for app mounting
                //appMountIds: ['app', "zip", "zap"],
                // baseHref: 'https://www.jacob-bogers.com' // all rels url go here, favicon, bundle.js etc
                // devServer: 'http://localhost:3000' , will try and load http://localhost:3000/webpack-dev-server.js
                lang: 'en-US',
                links: [], // external loadable fonts etc, whatever
                mobile: true,
                meta: [{
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                }],
            }),
            new CleanWebpackPlugin({
                verbose: true,
                dry: false
            }),
        ]
    };
    return [rc0];
};