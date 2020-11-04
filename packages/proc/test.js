const handlers = require('./metrics');
const fs = require('fs');
const { promisify } = require('util');

function loadFile(path) {
    const readable = fs.createReadStream(path, { flags: 'r', emitClose: true, start: 0 });
    readable.setEncoding('utf8');
    return new Promise((resolve, reject) => {
        const chunks = [];
        readable.on('data', chunk => {
            chunks.push(chunk);
        });
        readable.on('close', () => {
            resolve(chunks.join(''));
        })
        readable.on('end', () => {
            resolve(chunks.join(''));
        })
        readable.on('error', err => {
            reject(err);
        });
    });
}

// check it the file exist

// load it




const map = {
    '/proc/cpuinfo': './cpuinfo.txt', // check
    '/proc/self/io': './self_io.txt', // check
    '/proc/self/smaps': './self_smaps.txt', // check
    '/proc/self/statm': './self_statm.txt',// check
    '/proc/self/status': './self_status.txt', //check
    '/proc/self/buddyinfo': './buddyinfo.txt', // done
    '/proc/loadavg': './loadavg.txt', //check
    '/proc/meminfo': './meminfo.txt', //check
    '/proc/self/net/dev': './self_net_dev.txt', //check
    '/proc/uptime': './self_uptime.txt', //check
    '/proc/self/stat': './self_stat.txt',//todo
    '/proc/self/limits': './self_limits.txt'
}

// load all the fixtures and process them

async function init(...whitelist) {
    const paths = Object.keys(handlers);

    if (whitelist.length) {
        for (let i = 0; i < paths.length; ) {
            if (!whitelist.includes(map[paths[i]])) {
                paths.splice(i, 1);
                continue;
            }
            i++;
        }
    }

    const promises = Array.from({ length: paths.length });

    for (let i = 0; i < paths.length; i++) {
        console.log(`${paths[i]}>${map[paths[i]]}`);
        promises[i] = loadFile(map[paths[i]]);
    }

    return Promise.allSettled(promises).then(resolved => {
        // process all raw data
        const result = {};
        resolved.reduce((final, { status, value, reason }, i) => {
            const [[shortName, handler]] = Object.entries(handlers[paths[i]]);
            if (status === 'rejected') {
                final[shortName] = String(reason);
            }
            else {
                const resultObj = handler(value);
                if (resultObj) {
                    final[shortName] = resultObj;
                }
            }
            return final;
        }, result);
        return result;
    });
}

init('./self_limits.txt')
    .then(report => {
        console.log(JSON.stringify(report, null,4));
    })
    .catch(err => {
        console.log(`There was an error ${String(err)}`);
    });

