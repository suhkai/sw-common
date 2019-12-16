const {normalize, parse} = require('path');

const { features } = require('./dictionary');

features.set('filename', {
    factory: 0,
    name: 'filename',
    fn: file => {
        if (typeof a !== 'string'){
            return [undefined, `not a string`];
        }
        const { root, dir, base, ext, name } = parse(normalize(file));
        if (!(ext && name)){ // there is no file
            return [undefined,`"${file}" is does not contain a filename ending [name].[ext] format` ];
        }
        return [normalize(file), undefined];
    }
});

