const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
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
            minimizer: [new OptimizeCSSAssetsPlugin({})]
        },
        mode: 'production',
        entry: {
            'main.css': './src/main.css',
        },
        output: {
            globalObject: 'this'
        },
        module: {
            rules: [
                ///font files
                {
                    test: /\.(ttf|otf|woff|woff2|eot)$/,
                    loader: 'file-loader',
                    options: {
                        name: '/fonts/[name].[ext]'
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            }
                        }
                    ]
                },
                {
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
                                    "@babel/preset-typescript",
                                    // 'minify'
                                ],
                                plugins: [
                                    "@babel/proposal-class-properties",
                                    "@babel/proposal-object-rest-spread",
                                    "@babel/plugin-transform-async-to-generator",
                                    // 😠 😠😠😠
                                    // below plugin helps resolve this safari issue((
                                    // see link https://stackoverflow.com/questions/33878586/safari-babel-webpack-const-declarations-are-not-supported-in-strict-mode
                                    "@babel/plugin-transform-block-scoping"
                                ]
                            }
                        },
                        {
                            loader: 'ts-loader'
                        }
                    ]
                },
            ]
        },
        plugins: [
            //new MyExampleWebpackPlugin(),
            new ManifestPlugin({}),
            new BundleAnalyzerPlugin({
                analyzerMode: 'none'
            }),
            new HtmlWebPackPlugin({
                filename: 'index.html',
                excludeChunks: ['sw-notice', 'runtime-sw-notice'],
                hash: true,
                showErrors: true,
                xhtml: true,
                // template config
                template: 'src/template.html',
                inject: true, //inject assets into the given template  = false (template has own logic, leave it alone)
                meta: [{
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                }],
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
                chunkFilename: '[id].css',
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            }),
            //new HtmlWebpackTagsPlugin({ tags:['globals.css'], append: true }),
            new CleanWebpackPlugin({
                verbose: true,
                dry: false
            }),
            new webpack.optimize.ModuleConcatenationPlugin()
            //new CompressionPlugin()
        ]
    };
    return [rc0];
};