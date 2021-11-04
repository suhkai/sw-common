# Notes on NPM

## Life Cycle Scripts

### prepare

After various experimentation's, `prepare` script does not run on package install (as dependency); It is however run on `npm install` (in the repo of the package)

Runs before:

- runs before: `npm pack`
- runs before: `npm publish`
- runs after: `prepublish` (**DEPRICATED**)
- runs before: `prepublishOnly`
- prepare script is run on installation from `git` url
- these scripts run in the background,

### prepublish (**DEPRICATED**)

- Does not run on `npm publish`.
- Does run on `npm ci`
- Does run on `npm install`

### prepublishOnly

- runs before package is prepared and packed
- ONLY on `npm publish`

### prepack

- runs before tarball is packed
- runs before `npm pack`
- runs before `npm run pack`
- runs before `npm pack`

### postpack

- runs after the tarball ha been generated
- runs before it is moved to its final destination

## Life Cycle Operation Order

### npm cache add

- prepare

### `npm ci`

like `npm install` but:

- deletes `node_modules` before install
- does not change package.json package-lock.json

- `preinstall`
- `install`
- `postinstall`
- `prepublish` (**DEPRICATED**)
- `preprepare`
- `prepare`
- `postprepare`

### `npm diff`

This command cannot run (in windows at least) because there is an error

```bash
27 verbose stack %USERPROFILE%\AppData\Roaming\nvm\v16.13.0\node_modules\npm\node_modules\libnpmdiff:1
27 verbose stack ../packages/libnpmdiff
```

To correct this error remove file `$env:USERPROFILE\AppData\Roaming\nvm\v16.13.0\node_modules\npm\node_modules\libnpmdiff`

and replace it with a link to in the same place `$env:USERPROFILE\AppData\Roaming\nvm\v16.13.0\node_modules\npm\node_modules\libnpmdiff`
pointing to `$env:USERPROFILE\AppData\Roaming\nvm\v16.13.0\node_modules\npm\node_modules\libnpmdiff\packages\libnpmdiff`

Then it will work
This error is found at least in  

| Node version | npm version |
| ------------ | ----------- |
| v16.9.1      | v7.21.1     |
| v16.13.0     | v8.1.0      |

Example:

`npm diff --diff=lib-r-math.js@1.0.89 --diff=lib-r-math.js@1.0.88`

also single command is possible to compare with most recent

`npm diff --diff=lib-r-math.js@1.0.88`

### `npm install`

- `preinstall`
- `install`
- `postinstall`
- `prepublish` (**DEPRICATED**)
- `prepare`
- `postprepare`

### `npm pack`

- `prepack`
- `prepare`
- `postpack`

### `npm publish`

- `prepublishOnly`
- `prepack`
- `prepare`  (will not run during `--dry-run`)
- `postpack`
- `publish`
- `postpublish`

### `npm rebuild`

Rebuild a package

- runs `npm build`
- Usefull when you install new version of node
#### lifecycles

- preinstall
- install
- postinstall
- prepare

### `npm restart`

- prerestart
- restart
- postrestart

### `npm run <user defined>`

- `pre<user defined>`
- `<user defined>`
- `post<user defined>`

### `npm start`

If there is a server.js file in the root npm wil default `start` with `node server.js`

- `prestart`
- `start`  (can be replaced with `node server.js` if `start` is not defined)
- `poststart`

### `npm stop`

Shortcut for `npm run stop`

### `npm test`

Shortcut for `npm run test`

## Understanding Errors

- `TSError`: errors come from the compiler (same as `tsc`).
- `SyntaxError`: this is a `nodejs` error (maybe because of the version of js, in that case specify lower `CompilerOptions.target`.


