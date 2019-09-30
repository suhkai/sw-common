const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [new HtmlWebpackPlugin({
        title: 'this is the title',
        //filename: 'index[md5:contenthash:hex:9999].html',
        //filename: 'somehtml-file.html',
        //template: './index.ejs'
        inject: 'body', /* false= no injection, true|body= in the body, head= in the head*/
        favicon: './myfavicon.ico', // must be an actuall file,
        meta: {
            viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
        },
        minify: false,
        //hash: true,
        cache: false,
        showErrors: true,
        base: 'https://example.com',
        xhtml: true
    })]
};