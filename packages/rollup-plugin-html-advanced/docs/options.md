# options

| implemented? |                             Name | Type                          | Default                                               |
| :----------: | -------------------------------: | :---------------------------- | :---------------------------------------------------- |
|     yes      |                      **`title`** | `{String}`                    | `Webpack App`                                         |
|     yes      |                   **`filename`** | `{String}`                    | `'index.html'`                                        |
|      no      |                   **`template`** | `{String}`                    | ``                                                    |
|      no      |         **`templateParameters`** | `{Boolean\|Object\|Function}` | ``                                                    |
|      no      |                     **`inject`** | `{Boolean\|String}`           | `true`                                                |
|     90%      |                    **`favicon`** | `{String}`                    | ``                                                    |
|     yes      |                       **`meta`** | `{Object}`                    | `{}`                                                  |
|     yes      |                       **`base`** | `{Object\|String\|false}`     | `false`                                               |
|      no      |                     **`minify`** | `{Boolean\|Object}`           | `true` if `mode` is `'production'`, otherwise `false` |
|      no      |                       **`hash`** | `{Boolean}`                   | `false`                                               |
|      no      |                      **`cache`** | `{Boolean}`                   | `true`                                                |
|      no      |                 **`showErrors`** | `{Boolean}`                   | `true`                                                |
|      no      |                     **`chunks`** | `{?}`                         | `?`                                                   |
|      no      | **[`chunksSortMode`](#plugins)** | `{String\|Function}`          | `auto`                                                |
|      no      |              **`excludeChunks`** | `{Array.<string>}`            | ``                                                    |
|      no      |                      **`xhtml`** | `{Boolean}`                   | `false`                                               |