const fs = require('fs');
const { basename } = require('path');
const lstat = require('./lstat');
const readdir = require('./readdir');
const { root, INode } = require('./inode');

// async iterator
module.exports = async function getInodes(path /*string*/, skipDirCheck = false, dir) {
    // is the path a directory?
    
    if (!dir){
        dir = root.createInode('d', basename(path), undefined, { full: path } );
    }
    if (!skipDirCheck) {
        const [stat, error] = await lstat(path);
        if (error) {
            dir.ctx.error = `Cannot stat ${path}, ${error}`
            return dir;
        }
        if (!stat.isDirectory()) {
            dir.ctx.error = `${path} is not a directory`;
            return dir;
        }
    }
    
    const [fileNames, error] = await readdir(path);
    if (error) {
        dir.ctx.error = `failure to read directory ${path}`;
        return dir;
    }

    for (fileName of fileNames) {
        const fullp = path + '/' + fileName
        const node = dir.createInode('', fileName, undefined);
        const [stat, error] = await lstat(fullp);
        if (error) {
            node.ctx.error = `${error} while statting ${fullp}`
            return dir;
        }
        if (stat.isDirectory()) {
            node.type = 'd';
            await getInodes(fullp, true, node) || [];
            continue;
        }
        if (stat.isFile()) {
            node.type = 'f';
            node.size = stat.size; 
            continue;
        }
        node.type = 'o';  
    }
    return dir;
};
