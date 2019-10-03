const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [new HtmlWebpackPlugin({
        // std
        title: 'rollup app', // default
        // std
        filename: 'index.html', // relative to outdir , relative to cwd-dir!!
        // later, but skip it for now
        template: require('html-webpack-template'),
        // std 
        inject: 'body', /* false= no injection, true|body= in the body, head= in the head*/
        // deferred, favicon , injection -- make it pluggable with the reformatting 
        favicon: './myfavicon.ico', // must be an actuall file,
        // std
        meta: {
            name: 'description',
            content: 'Rogue game, Quest for Dungeon remake in HTML5'
        },
        // TODO: later we have library for that, should be included
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
        //
        // sets meta tag for page scaling
        mobile: true,  //what does this do?
        // no
        cache: true,
        // later
        showErrors: true,
        // yes
        baseHref: 'https://example.com',
        // no
        xhtml: true,
        // sure
        appMountId: 'app',
    })]
};