const fs = require('fs');

module.exports = async function readdir(dir) {
    return new Promise(resolve => {
        fs.readdir(dir, { endcoding: 'utf8' }, (err, files) => {
            if (err) {
                resolve([undefined, error]);
                return;
            }
            resolve([files, undefined]);
        });
    });
};