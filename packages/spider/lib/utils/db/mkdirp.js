const fs = require('fs');
const { lexPath, $tokens } = require('@mangos/filepath')

async function lstat(path, options) {
    return new Promise(resolve => {
        fs.lstat(path, (err, stats) => {
            if (err){
                resolve([undefined, err]);
                return;
            }
            resolve([stats, undefined]);
        });
    });
}

async function mkdir(path, mode){
    return new Promise(resolve => {
        fs.mkdir(path, err => {
            if (err){
                resolve([undefined, err]);
                return;
            }
            resolve([true, undefined]);
        });
    });
}

module.exports = async function mkdirp(path, ft = 'posix', mode = 0o777) {
    const info = lexPath(path, { [ft]: true });

    if (!info){
        return [undefined, `invalid path name:"${path}"`];
    }
    if (info.firstError) {
        return [undefined, info.firstError];
    }
    const subPath = [];
    for (let i = 0; i < info.path.length; i++) {
        subPath.push(info.path[i].value);
        if (info.path[i].token === $tokens.other.SEP){
            continue;
        }
        const spath = subPath.join('');
        const [stats, error] = await lstat(spath);
        if (error){
            if (error.code !== 'ENOENT'){
                return [undefined, error];
            }
            // create subpath
            const [, err] = await mkdir(spath, mode);
            if (err){
                return [undefined, `could not create ${path} up to ${spath} because of ${String(err)}`];
            }
            continue;
        }
        if (!stats.isDirectory()){
            return [undefined, `${spath} is not a directory`];
        }
        
    }
    return [true, undefined];
}