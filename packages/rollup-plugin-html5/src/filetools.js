const path = require('path');

// navigate(outputfile, and outputfile) --> normalize, strip base names 

/* tests (but it in mocha)
const result1 = linkPositionFromFile(process.cwd(), '../images/1.jpg');
const result2 = linkPositionFromFile(process.cwd() + '/index.html', '../images/1.jpg');
const result3 = linkPositionFromFile(process.cwd() + '/index.html', process.cwd() + '/images/1.jpg');
const result4 = linkPositionFromFile('index.html', process.cwd() + '/images/1.jpg');
const result5 = linkPositionFromFile('a/b/c/index.html', '/a/b/images/1.jpg');
const result6 = linkPositionFromFile('b/c/index.html', 'a/b/images/1.jpg');
const result7 = linkPositionFromFile('b/c/index.html', 'b/c/images/1.jpg');
*/

function diff(from,to){
    if (path.isAbsolute(from) !== path.isAbsolute(to)){
        // both must be absolute or both must be relative
        return [undefined, `path ${a} and ${b} are not of the same type both must be absolute or relative`];
    }
    return path.relative(from,to);
}

function add(from, to){
    if (path.isAbsolute(to)){
        return [undefined, `"${to}" is not a relative path`];
    }
    const final = path.join(from, to);
    return [final, undefined];
}

function normDir(file){
    const { root, dir, base, ext, name } = path.parse(path.normalize(file));
    if (ext) {
        return path.format({root, dir});
    }
    return path.format({root, dir, base});
}

function linkPositionFromFile(file, asset){
    // if asset is a absoluute path then file needs to be it also
    if (path.isAbsolute(asset) && !path.isAbsolute(file)){
        return [undefined, `"${file}" needs to be absolute path if "${asset}" is aswell`]
    }
    if (path.isAbsolute(asset) && path.isAbsolute(file)){
        const dir = normDir(file);
        const relative = path.relative(dir, path.normalize(asset));
        return relative.replace(/\\/g,'/');;
    }
    // convert to basedirs, strip off basenae
    let dir  = normDir(file); 
    let relative = path.relative(dir, path.normalize(asset));
    relative = relative.replace(/\\/g,'/');
    return [relative, undefined];
}

module.exports = {
    diff,
    add,
    linkPositionFromFile
};
