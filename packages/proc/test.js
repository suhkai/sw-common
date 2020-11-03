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
    '/proc/cpuinfo': './cpuinfo.txt',
    '/proc/self/io': './self_io.txt',
    '/proc/self/smaps': './self_smaps.txt',
    '/proc/self/statm': './self_statm.txt',
    '/proc/self/status': './self_status.txt',
    '/proc/self/buddyinfo': './buddyinfo.txt',
    '/proc/loadavg': './loadavg.txt',
    '/proc/meminfo': './meminfo.txt',
    '/proc/self/net/dev': './self_net_dev.txt',
    '/proc/uptime': './self_uptime.txt',
    '/proc/self/stat': './self_stat.txt',
    '/proc/self/limits': './self_limits.txt'
}

// load all the fixtures and process them

async function init() {
    const paths = Object.keys(handlers);
    const promises = Array.from({ length: handlers.length });
    
    for (let i = 0; i < paths.length; i++) {
        console.log(`${paths[i]}>${map[paths[i]]}`);
        promises[i] = loadFile(map[paths[i]]);
    }

    return Promise.allSettled(promises).then(resolved => {
        // process all raw data
        const result = {};
        resolved.reduce((final,{ status, value, reason }, i)=>{
            const [ [shortName, handler] ] = Object.entries(handlers[paths[i]]);
            if (status === 'rejected'){
                final[shortName] = String(reason);
            }
            else {
                console.log(handlers[paths[i]]);
               const resultObj = handler(value);
               if (resultObj){
                   final[shortName] = resultObj;
               }
            }
            return final;
        },result);
        return result;
    });
}

init()
.then(report => console.log(report))
.catch(err => {
    console.log(`There was an error ${String(err)}`);
});

