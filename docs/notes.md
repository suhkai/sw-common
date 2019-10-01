// https://hackernoon.com/building-and-publishing-a-module-with-typescript-and-rollup-js-faa778c85396
// ^this one looks good
// following https://github.com/Microsoft/TypeScript-Babel-Starter#using-rollup
// for css
// https://lengstorf.com/learn-rollup-css/
// https://github.com/borodean/postcss-assets

Nice:
Using a rollup plugin to generate a html resource

https://gitlab.com/thekelvinliu/rollup-plugin-static-site

make a simple html plugin

htmlwebpack plugins (sub plugins)

-- webpack-subresource-integrity
https://www.npmjs.com/package/webpack-subresource-integrity

subresource integrety https://www.w3.org/TR/SRI/ (integrity attribute??)

-- appcache-webpack-plugin
this is the old appcache PWA feature (application Cache under devtools)

-- favicons-webpack-plugin

https://github.com/jantimon/favicons-webpack-plugin

has wonderfull html injection
Note: html-webpack-plugin must come before favicons-webpack-plugin in the plugins array.
path to logo can be relative, absolute path (from //) or node module resolution path (no / or ./ as part of the name)

https://github.com/jantimon/favicons-webpack-plugin#advanced-usage

under the hood uses https://github.com/itgalaxy/favicons (node module)
// wonderfull i can use this to make manifest.json files)))


-- html-webpack-harddisk-plugin
doesnt seem usefull 
WAIT, i see multi use of HTMLWebpackplugin to generate seperate html files, with diff configurations
and (alwaysWriteToDisk: true)
https://github.com/jantimon/html-webpack-harddisk-plugin#basic-usage


-- html-webpack-inline-source-plugin

embed jss and css inline (wut?)

-- html-webpack-inline-svg-plugin  
can make sense maybe, dont know))

-- html-webpack-inline-svg-plugin  

-- html-webpack-exclude-assets-plugin
    exclude assets from the html-webpack -plgn
    exclude assets by adding property "excudeAssets":[...] 

-- html-webpack-tags-plugin
    you could be copying assets outside the html build pipeline into the output dir
    with this plugin you can inject the tags manually
    new HtmlWebpackTagsPlugin({ tags: ['a.js', 'b.css'], append: true })

-- html-webpack-injector
    Suppose you want have `2 chunks` that you want to inject in the html document using HtmlWebpackPlugin.
    If you want to inject `one chunk in head` and `one chunk in body` of the same html document
    (uses the "_head" suffix in the "entry" props to designate head or body injection

### resource-hints-webpack-plugin
    
See [w3c](https://www.w3.org/TR/resource-hints/).

Example:

```html
<link rel="prefetch" href="//example.com/next-page.html" as="document" crossorigin="use-credentials">
<link rel="prefetch" href="/library.js" as="script">    
```

It adds automatically resource-hints to your html files to improve your load time.
    
```javascript
    plugins: [
        new HtmlWebpackPlugin({
            prefetch: ['**/*.*'],
            preload: ['**/*.*']
        }),
        new ResourceHintWebpackPlugin()
    ]
```

### preload-webpack-plugin

See [w3c](https://w3c.github.io/preload/).

Takes routes you code plit and preloads them using `<link rel="preload" as="script" ..>` or prefetch `<link rel="prefetch" as="script" ..>`


### link-media-html-webpack-plugin

Allows for injected stylesheet <link /> tags to have their media attribute set.

Example: 
```html
<link ... media="(min-width: 700px), handheld and (orientation: landscape)" />
```

### inline-chunk-manifest-html-webpack-plugin

Script tag to assign global webpack manifest variable, injected in `<head>`

Example:
```html
<head>
  <script>window.webpackManifest={"0":"0.bcca8d49c0f671a4afb6.dev.js","1":"1.6617d1b992b44b0996dc.dev.js"}</script>
</head>
```

### html-webpack-inline-style-plugin

For inlining styles using [juice](https://github.com/Automattic/juice)

### html-webpack-exclude-empty-assets-plugin

Will exclude empty assets from injection into hmtl (solves some issues with webpack 4.0)


### webpack-concat-plugin

Concat js and inject it into the html

### html-webpack-link-type-plugin 

for compatibility with "strict mode".

add `type` attribute to your <link.. > based on the emitted file extension

this means `<link ...>` is equal to `<script>` if `<link type="application/javascript" />`

[link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#HTML_Attributes) as following attribs:

### csp-html-webpack-plugin

- More [csp](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) info.
- List of [options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy).

### webpack-nomodule-plugin

Assigns the `nodmodule` attribute to script tags injected by Html Webpack Plugin

```javascript
plugins: [
     .
     .
     ,
     new WebpackNoModulePlugin({
            filePatterns: ['polyfill.**.js']
     })
]
```

## dom parsing

https://www.npmjs.com/package/xmldom
https://www.npmjs.com/package/jsdom
https://www.npmjs.com/package/parse5   <-- seems to be enough also "cleans" html a bit

tidy html

https://www.npmjs.com/package/libtidy-updated
https://github.com/htacg/tidy-html5
















