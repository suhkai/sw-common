const fs = require('fs');

const lstat = require('./lstat');
const readdir = require('./readdir');

// async iterator
module.exports = async function getAllInodes(path /*string*/, skipDirCheck = false) {
    // is the path a directory?
    const rc = [];
    if (!skipDirCheck) {
        const [stat, error] = await lstat(path);
        if (error) {
            rc.push([undefined, `Cannot stat ${path}, ${error}`]);
            return rc;
        }
        if (!stat.isDirectory()) {
            rc.push([undefined, `${path} is not a directory`]);
            return rc;
        }
    }
    const [fileNames, error] = await readdir(path);
    if (error) {
        rc.push([undefined, `failure to read directory ${path}`]);
        return rc;
    }

    for (fileName of fileNames) {
        const fullp = path + '/' + fileName
        const [stat, error] = await lstat(fullp);
        if (error) {
            rc.push([undefined, `${error} while statting ${fullp}`]);
            continue;
        }
        if (stat.isDirectory()) {
            const subRc = await getAllInodes(fullp, true);
            rc.push(...subRc);
            continue;
        }
        if (!stat.isFile()) {
            continue;
        }
        rc.push([{ fullp, stat }, undefined]);
    }
    return rc;
};
