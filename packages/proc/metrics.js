function noop() { }

function isNumStr(str) {
  return /^[0-9]+$/.test(str);
}

function cpuInfo(keys = [
  'processor',
  'vendor-id',
  'cpu family',
  'model name',
  'physical id',
  'siblings',
  'cpu Mhz',
  'cache size',
  'cpu cores',
  'api-cid',
]) {
  return function (text) {
    const results = [];
    for (const processor of text.split('\n\n')) {
      const entryLines = processor.split('\n');
      const cpu = {};
      for (const line of entryLines) {
        const [key, value] = line.split(':').map(s => s.trim())
        if (keys.includes(key) && value) {
          cpu[key] = value;
        }
      }
      results.push(cpu);
    }
    return results;
  }
}

function selfIo(text) {
  const lines = text.split('\n').filter(f => f);
  const results = lines.reduce((c, line) => {
    const [key, value] = line.split(':').map(s => s.trim());
    if (value) {
      c[key] = parseInt(value, 10);
    }
    return c;
  }, {});
  return results;
}


// only get KernelPageSize and MMUPageSize
function selfSmaps(text) {

  let cursor = 0;

  const lines = text.split('\n').filter(f => f);

  const regExpHeaders = /^([0-9A-Za-z]+\-[0-9A-Za-z]+)\s+([rwxsp-]+)\s([0-9A-Za-z]+)\s+([0-9:]+)\s+([0-9]+)\s+([^\s]+)?/;

  const mods = [];

  function* moduleLines() {
    while (cursor < lines.length && lines[cursor]) {
      if (lines[cursor].match(regExpHeaders) !== null) {
        return;
      }
      const [key, value] = lines[cursor].split(':').map(s => s.trim().toLowerCase());
      yield [key, value];
      cursor++;
    }
  }

  while (cursor < lines.length && lines[cursor]) {
    const mod = lines[cursor].match(regExpHeaders);
    if (mod !== null) {
      const info = ['address', 'perms', 'offset', 'dev', 'inode', 'pathname'].reduce((c, prop, i) => {
        if (mod[i + 1]) {
          c[prop] = mod[i + 1];
        }
        return c;
      }, {})
      info.d = {};
      cursor++;
      for (const [key, value] of moduleLines()) {
        info.d[key] = value;
      }
      mods.push(info);
      continue;
    }
    cursor++;
  }
  return mods;
}

function selfStatm(text) {
  const values = text.split(/\s+/).map(n => parseInt(n, 10));
  const result = [
    'size',
    'resident',
    'share',
    'text',
    'lib',
    'data',
    'dt'
  ].reduce((c, s, i) => {
    c[s] = values[i]
    return c;
  }, {});
  delete result.lib;
  delete result.dt;
  return result;
}

function selfStatus(text) {
  const lines = text.split('\n').filter(f => f);
  const result = {};
  for (const line of lines) {
    const [key, value] = line.split(':').map(s => s.trim().toLowerCase());
    if ([
      'uid',
      'gid',
      'groups',
      'sigq',
      'sigpnd',
      'shdpnd',
      'sigblk',
      'sigign',
      'sigcgt',
      'capinh',
      'capprm',
      'capeff',
      'capbnd',
      'capamb',
      'seccomp'
    ].includes(key)) {
      continue;
    }
    result[key] = value;
  }
  return result;
}

function buddyInfo(text) {
  /**
   *   Node 0, zone     DMA     1    1    1    0    2    1    1    0    1    1    3
  Node 0, zone   DMA32    65   47    4   81   52   28   13   10    5    1  404
  Node 0, zone  Normal   216   55  189  101   84   38   37   27    5    3  587
   * 
   */
  const result = {};
  const lines = text.split('\n').filter(f => f);
  if (!lines.length) {
    return;
  }
  let pos = 0;
  for (const line of lines) {
    // get the node
    let nodeName;
    let zoneName;
    pos = 0;
    {
      const node = line.match(/^([^,]+),/);
      if (!node) {
        continue;
      }
      nodeName = node[1];
      pos = node[0].length;
    }
    // get the zone
    {
      const zone = line.slice(pos).match(/^\s*zone\s+([^\s]+)/);
      if (!zone) {
        continue;
      }
      zoneName = zone[1];
      pos += zone[0].length;
    }
    // get the numbers
    const numbers = line.slice(pos).split(/\s+/).filter(f => f).map(s => parseInt(s, 10));
    if (!numbers.length) {
      continue;
    }
    // 
    result[nodeName] = result[nodeName] || {};
    result[nodeName][zoneName] = numbers
  }
  return Object.keys(result).length ? result : undefined;
}
//0.37 0.51 0.75 6/688 87233
function loadAverage(text) {
  const vals = text.split(/\s+/).filter(f => f);
  if (!vals.length) {
    return;
  }
  // running processes
  let crp = -1;
  let trp = -1;
  {
    const prs = vals[3].match(/([0-9]+)\/([0-9]+)/);
    if (prs) {
      crp = parseInt(prs[1], 10);
      trp = parseInt(prs[2], 10);
    }
  }
  return {
    '1m': parseFloat(vals[0], 10),
    '5m': parseFloat(vals[1], 10),
    '10m': parseFloat(vals[2], 10),
    crp,
    trp,
    lpu: parseInt(vals[4])
  };
}

function memInfo(text) {
  const lines = text.split('\n').filter(f => f);
  const result = {};
  for (const line of lines) {
    const [prop, value] = line.split(':').map(s => s.trim());
    if (prop && value) {
      result[prop] = value;
    }
  }
  return result;
}
/*
Inter-|   Receive                                                |  Transmit
 face |bytes    packets errs drop fifo frame compressed multicast|bytes    packets errs drop fifo colls carrier compressed
    lo: 5548092   85227    0    0    0     0          0         0  5548092   85227    0    0    0     0       0          0
enp0s3: 1069906047  813995    0    0    0     0          0         0 14541176  101662    0    0    0     0       0          0
*/
function netDev(text) {
  const lines = text.split('\n').slice(2); // skip first 2 lines (its a headers)
  ///
  const result = {};
  for (const line of lines) {
    const s = line.indexOf(':');
    if (s < 0) {
      continue;
    }
    const entry = line.slice(0, s).trim();
    const vals = line.slice(s + 1).split(/\s+/).filter(f => f).map(v => parseInt(v, 10));
    // receive part
    result[entry] = {};
    result[entry].receive = {
      bytes: vals[0],
      packets: vals[1],
      errs: vals[2],
      drop: vals[3],
      fifo: vals[4],
      frame: vals[5],
      compressed: vals[6],
      multicast: vals[7]
    };
    result[entry].transmit = {
      bytes: vals[8],
      packets: vals[9],
      errs: vals[10],
      drop: vals[11],
      fifo: vals[12],
      colls: vals[13],
      carrier: vals[14],
      compressed: vals[15]
    }
  }
  return Object.keys(result).length ? result : undefined;
}

// 350735.47 234388.90
function uptime(text) {
  const [system, idle] = text.split(/\s+/).filter(f => f).map(v => parseFloat(v));
  return {
    system,
    idle
  };
}

//86383 (node) S 86371 86383 86371 34817 86383 4194304 13348 0 14 0 123 91 0 0 20 0 11 0 6881749 636669952 10461 18446744073709551615 4194304 4199205 140732121962768 0 0 0 0 4096 134234626 0 0 0 17 0 0 0 3 0 0 4210024 4210704 12226560 140732121964672 140732121964677 140732121964677 140732121968618 0
function selfStat(text) {

}

function selfLimits(text) {
  const lines = text.split('\n').filter(f => f).map(s => s.toLowerCase());
  // get position from headers
  const header = lines.shift();
  let p2 = header.search(/soft limit/);
  let p3 = header.search(/hard limit/);
  let p4 = header.search(/units/);

  const result = {};
  for (const line of lines){
    const name  =  line.slice(0, p2).trim();
    const soft = line.slice(p2,p3).trim();
    const hard = line.slice(p3, p4).trim();
    const unit = line.slice(p4).trim();
    result[name] = {
      soft: isNumStr(soft) ? parseInt(soft, 10): soft,
      hard: isNumStr(hard) ? parseInt(hard, 10): hard,
    };
    if (unit){
      result[name].unit = unit;
    }
  }
  return Object.keys(result).length ? result: undefined
}

const handlers = {
  '/proc/cpuinfo': { info: cpuInfo() },
  '/proc/self/io': { io: selfIo },
  '/proc/self/smaps': { smaps: selfSmaps },
  '/proc/self/statm': { statm: selfStatm },
  '/proc/self/status': { status: selfStatus },
  '/proc/self/buddyinfo': { buddy: buddyInfo },
  '/proc/loadavg': { loadavg: loadAverage },
  '/proc/meminfo': { meminfo: memInfo },
  '/proc/self/net/dev': { netDev: netDev },
  '/proc/uptime': { uptime: uptime },
  '/proc/self/stat': { stat: selfStat },
  '/proc/self/limits': { limits: selfLimits }
};

module.exports = handlers;