# options

| implemented? |                             Name | Type                          | Default                                               |
|:------------:|---------------------------------:|:------------------------------|:------------------------------------------------------|
|     yes      |                      **`title`** | `{String}`                    | `Webpack App`                                         |
|     yes      |                   **`filename`** | `{String}`                    | `'index.html'`                                        |
|      no      |                   **`template`** | `{String}`                    | ``                                                    |
|      no      |         **`templateParameters`** | `{Boolean\|Object\|Function}` | ``                                                    |
|     yes      |                     **`inject`** | `{Boolean\|String}`           | `true`                                                |
|     90%      |                    **`favicon`** | `{String}`                    | ``                                                    |
|     yes      |                       **`meta`** | `{Object}`                    | `{}`                                                  |
|     yes      |                       **`base`** | `{Object\|String\|false}`     | `false`                                               |
|      no      |                     **`minify`** | `{Boolean\|Object}`           | `true` if `mode` is `'production'`, otherwise `false` |
|      no      |                       **`hash`** | `{Boolean}`                   | `false`                                               |
|      no      |                      **`cache`** | `{Boolean}`                   | `true`                                                |
|      no      |                 **`showErrors`** | `{Boolean}`                   | `true`                                                |
|     N/A      |                     **`chunks`** | `{?}`                         | `?`                                                   |
|      no      | **[`chunksSortMode`](#plugins)** | `{String\|Function}`          | `auto`                                                |
|     yes      |              **`excludeChunks`** | `{Array.<string>}`            | ``                                                    |
|      no      |                      **`xhtml`** | `{Boolean}`                   | `false`                                               |


## Steps:

### initial
Generate special 'relative paths based on out.dir and location of index.html.  
You can have your own build in handlers,-- like injecting css and injecting, meta etc etc the overall plugin will take the injections as is and clean them up accourdingly
Some handlers are "blessed" like html templating engines. (guess i have to learn an html templating engine).
 
### handler lifecycle-hooks

- 1:Registration sequence, claim properties in the "options" object, if there is a namespace collision, describe and abort abort.
    - the registration porcess, decides on what options are manditory, defaults values, etc
        - 1.a: there is an inversion check on startup, basicly, the framework can ask handlers if there is an option they are interested in, infact if an option is specified that has no subcribed interest   then a warning should be issued (through the context)

- 2.b: the handlers should not have access to the plugin context, give back an injection structure, like favicon,   { html, assets, chunks}  (favicons has extra files, but that is not really needed to have this superate class)
- 2:Generate assets/files (emit them). (you have access to all handlers and namespaces);
- 3:Html injection sequence:
    - manually added links, meta and source.
    - generated assets and html snippets (location is important).
- 4:Post production (where in the DOM to inject the html snippets?) and it what order (sorting of snippets)
    - all css and js injection is sorted, per "head" or per "body" segment sort js injection.
    - css are injected in head and sorted, "href"
- 5:create final html file