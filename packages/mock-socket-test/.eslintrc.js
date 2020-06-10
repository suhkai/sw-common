module.exports = {
    env: {
        node: true,
        es6: true,
        mocha: true
    },
    extends: "@csimi/eslint-config",
    root: false,
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module'
    },
    globals: {
        module: true
    },
    rules: {
        'no-constant-condition': ["error", { "checkLoops": false }]
    }
};