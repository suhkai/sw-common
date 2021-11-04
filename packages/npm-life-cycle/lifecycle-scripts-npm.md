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

- preinstall
- install
- postinstall
- prepublish
- preprepare
- prepare
- postprepare

### `npm diff`

- prepare

### `npm install`

- preinstall
- install
- postinstall
- prepublish
- prepare
- postprepare

### `npm pack`

- `prepack`
- `prepare`
- `postpack`

