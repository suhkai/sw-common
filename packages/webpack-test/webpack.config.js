const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [new HtmlWebpackPlugin({
        template: require('html-webpack-template'),
        title: 'this is the title',
        //filename: 'index[md5:contenthash:hex:9999].html',
        //filename: 'somehtml-file.html',
        //template: './index.ejs'
        inject: 'body', /* false= no injection, true|body= in the body, head= in the head*/
        favicon: './myfavicon.ico', // must be an actuall file,
        meta: {
            name: 'description',
            content: 'Rogue game, Quest for Dungeon remake in HTML5'
        },
        minify: {
            caseSensitive: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            html5: true,
            keepClosingSlash: true,
            useShortDoctype: true,
        },
        mobile: true,
        cache: true,
        showErrors: true,
        baseHref: 'https://example.com',
        xhtml: true,
        appMountId: 'app',
    })]
};