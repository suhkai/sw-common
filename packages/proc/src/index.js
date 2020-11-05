const fs = require('fs');
const { promisify } = require('util');

const info = require('./cpuinfo');
const io = require('./io');
const smaps = require('./smaps');
const statm = require('./statm');
const status = require('./status');
const buddy = require('./buddy');
const loadavg = require('./loadavg');
const meminfo = require('./meminfo');
const netDev = require('./netDev');
const uptime = require('./uptime');
const limits = require('./limits');

const C = {};
C.CPUINFO = '/proc/cpuinfo';
C.MEMINFO = '/proc/meminfo';
C.LOADAVG = '/proc/loadavg';
C.UPTIME = '/proc/uptime';

C.SELF = {};
C.SELF.IO = '/proc/self/io';
C.SELF.SMAPS = '/proc/self/smaps';
C.SELF.STATM = '/proc/self/statm';
C.SELF.STATUS = '/proc/self/status';
C.SELF.BUDDYINFO = '/proc/self/buddyinfo'
C.SELF.LIMITS = '/proc/self/limits';

C.SELF.NET = {};
C.SELF.NET.DEV = '/proc/self/net/dev';

const handlerMap = {
  [C.CPUINFO]: { info },
  [C.LOADAVG]: { loadavg },
  [C.MEMINFO]: { meminfo },
  [C.UPTIME]: { uptime },

  [C.SELF.IO]: { io },
  [C.SELF.SMAPS]: { smaps },
  [C.SELF.STATM]: { statm },
  [C.SELF.STATUS]: { status },
  [C.SELF.BUDDYINFO]: { buddy },
  [C.SELF.LIMITS]: { limits },
  [C.SELF.NET.DEV]: { netDev }
};


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

function getProcReports(handlers, ...procList) {
  const promises = [];
  if (procList.length === 0){
    procList = Object.keys(handlers);
  }

  for (let i = 0; i < procList.length; i++) {
    promises.push(loadFile(procList[i]));
  }

  return Promise.allSettled(promises).then(resolved => {
    // process all raw data
    const result = {};
    resolved.reduce((final, { status, value, reason }, i) => {
      const [[shortName, handler]] = Object.entries(handlers[procList[i]]);
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

module.exports = {
  constants: C,
  getProcReports,
  handlerMap
};
