
const fs = require('fs');

module.exports = function lstat(file) {
    return new Promise(resolve => {
        fs.lstat(file, (err, stat) => {
            if (err) {
                resolve([undefined, err]);
                return;
            }
            resolve([stat, undefined]);
        });
    });
};

