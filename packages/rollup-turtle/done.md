# big list of options

| options                            | done                            | notes                                                                                         |
| ---------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| external                           | 17-10-20                        | list of options as they appear in source files                                                |
| input                              | 17-10-20                        | entry of names                                                                                |
| input.dir                          | 17-10-20                        |                                                                                               |
| output.file                        | 17-10-20                        | only for single bundle builds                                                                 |
| output.format                      | 17-10-20                        | format of the bundle, keep "es" for dev                                                       |
| output.globals                     | 17-10-20                        | map external to global name for imports in iife and umd bundles                               |
| output.name                        | 17-10-20                        | how iife/umd will export the bundle                                                           |
| output.plugins                     |                                 |                                                                                               |
| plugins                            | 17-10-20                        | regular plugins  (this is not how to build plugins)                                           |
| cache                              | use it                          | ignored if falsy, but not ignored if explicit set to `false` or `true`                        |
| onwarn                             | 17-10-20                        | warning callback                                                                              |
| output.assetFileNames              | need plugin to get this to work | only triggered by plugin generating an asset                                                  |
| output.banner                      | 17-10-20                        | dont forget `/*`  and `*/` in the return string                                               |
| output.footer                      | 17-10-20                        |                                                                                               |
| output.chunkFileNames              | 17-10-20                        | weird its called 2x if it is a function, so needs to be idempotent!!                          |
| output.entryFileNames              | 17-10-20                        | weird its called 2x if it is a function, so needs to be idempotent!!                          |
| output.compact                     | 17-10-20                        | removes whitespace and some newlines, no further minimization                                 |
| extend                             | 19-10-20                        | for iffe will extend the global var not replace it                                            |
| output.hoistTransitiveImports      | 19-10-20                        | it works like a preload                                                                       |
| output.inlineDynamicImports        | 19-10-20                        | mimics via Promise.prototype.then                                                             |
| output.interop                     | 19-10-20                        | ok                                                                                            |
| output.intro                       | 19-10-20                        | ok                                                                                            |
| output.outro                       | 19-10-20                        | ok                                                                                            |
| output.manualChunks                | 19-10-20                        | ok, got it to work with a function , otherwise it doenst generate a meaningfull vender bundle |
| output.minifyInternalExports       | 18-10-20                        | ok                                                                                            |
| output.paths                       | 19-10-20                        | use instead of a global (iife) a "path" (amd) can load from an url-path                       |
| output.preserveModules             | 19-10-20                        |                                                                                               |
| preserveEntrySignatures            | 19-10-20                        | readed                                                                                        |
| strictDeprecations                 | 19-10-20                        | readed                                                                                        |
| acorn                              | no                              |                                                                                               |
| acornInjectPlugins                 | no                              |                                                                                               |
| context                            | 19-10-20                        | readed                                                                                        |
| moduleContext                      | 19-10-20                        | readed                                                                                        |
| output.amd.id                      | 19-10-20                        | readed                                                                                        |
| output.amd.define                  | 19-10-20                        | readed                                                                                        |
| output.esModule                    | 19-10-20                        | readed                                                                                        |
| output.exports                     | 19-10-20                        | readed                                                                                        |
| output.externalLiveBindings        | 19-10-20                        | readed                                                                                        |
| output.freeze                      | 19-10-20                        | readed                                                                                        |
| output.ident                       | wut?                            | ??                                                                                            |
| output.namespaceToStringTag        | 19-10-20                        | readed                                                                                        |
| output.noConflict                  | wut?                            |                                                                                               |
| output.preferConst                 | 19-10-20                        | readed                                                                                        |
| output.strict                      | 19-10-20                        | readed                                                                                        |
| output.systemNullSetters           | 19-10-20                        | readed                                                                                        |
| preserveSymlinks                   | 19-10-20                        | readed                                                                                        |
| shimMissingExports                 | 19-10-20                        | readed                                                                                        |
| treeshake.annotations              | 19-10-20                        | readed                                                                                        |
| treeshake.moduleSideEffects        | 19-10-20                        | readed                                                                                        |
| treeshake.propertyReadSideEffects  | 19-10-20                        | readed                                                                                        |
| treeshake.tryCatchDeoptimization   | 19-10-20                        | readed                                                                                        |
| treeshake.unknownGlobalSideEffects | ??                              | ??                                                                                            |