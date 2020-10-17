# big list of options

| options               | done                            | notes                                                                  |
| --------------------- | ------------------------------- | ---------------------------------------------------------------------- |
| external              | 17-10-20                        | list of options as they appear in source files                         |
| input                 | 17-10-20                        | entry of names                                                         |
| input.dir             | 17-10-20                        |                                                                        |
| output.file           | 17-10-20                        | only for single bundle builds                                          |
| output.format         | 17-10-20                        | format of the bundle, keep "es" for dev                                |
| output.globals        | 17-10-20                        | map external to global name for imports in iife and umd bundles        |
| output.name           | 17-10-20                        | how iife/umd will export the bundle                                    |
| output.plugins        |                                 |                                                                        |
| plugins               | 17-10-20                        | regular plugins  (this is not how to build plugins)                    |
| cache                 | use it                          | ignored if falsy, but not ignored if explicit set to `false` or `true` |
| onwarn                | 17-10-20                        | warning callback                                                       |
| output.assetFileNames | need plugin to get this to work | only triggered by plugin generating an asset                           |
| output.banner         | 17-10-20                        | dont forget `/*`  and `*/` in the return string                        |
| output.footer         | 17-10-20                        |                                                                        |
| output.chunkFileNames | 17-10-20                        | weird its called 2x if it is a function, so needs to be idempotent!!   |
| output.entryFileNames | 17-10-20                        | weird its called 2x if it is a function, so needs to be idempotent!!   |
| output.compact        | 17-10-20                        | removes whitespace and some newlines, no further minimization          |


