function noop() { }

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
    for (const processor of text.slit('\n\n')) {
      const entryLines = processor.split('\n');
      const cpu = {};
      for (const line of entryLines) {
        const [key, value] = line.split(':').map(s => s.trim())
        if (keys.includes(key)) {
          cpy[key] = value;
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
    c[key] = parseInt(value, 10);
    return c;
  }, {});
  return results;
}


// only get KernelPageSize and MMUPageSize


function selfSmaps(text){
  
  let cursor = 0;

  const lines = text.split('\n').filter(f=>f);

  const regExpHeaders = /^([0-9A-Za-z]+\-[0-9A-Za-z]+)\s+([rwxsp-]+)\s([0-9A-Za-z]+)\s+([0-9:]+)\s+([0-9]+)\s+([^\s]+)/;

  const mods = [];

  function* moduleLines(){
    while (cursor < lines.length && lines[cursor]){
      if (lines[start].match(regExpHeaders) === null){
         return;
      }
      const [key, value] = lines[start].split(':').map(s=>s.trim().toLowerCase());
      yield [key,value];
      cursor++;
    }
  }

  while(cursor < lines.length && lines[cursor]){
    const mod = lines.match(regExpHeaders);
    if (mod !== null){
      const info = {
        address: mod[1],
        perms: mod[2],
        offset: mod[3],
        dev: mod[4],
        inode: mod[5],
        pathname: mod[6]
      };
      info.d = {};
      cursor++;
      for (const [key, value] of moduleLines()){
         info.d[key]=value; 
      }
      mods.push(info);
      continue;
    }
    cursor++;
  }
  return mods;
}

function selfStatm(text){
  const values = text.split(/\s+/).map( n => parseInt(n, 10));
  const result = [
    'size',
    'resident',
    'share',
    'text',
    'lib',
    'data',
    'dt'
  ].reduce((c,s,i)=>{
    c[s]=values[i]
    return c;
  },{});
  return result;
}

function selfStatus(text){
  const lines = text.split('\n').filter(f=>f);
  const result = {};
  for (const line of lines){
    const [ key, value ] = line.split(':').map( s => s.trim().toLowerCase() );
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
    ].includes(key)){
      continue;
    }
    result[key] = value;
  }
  return result;
}

function buddyInfo(){

}

function loadAverage(){

}

function memInfo(){

}

function netDev(){

}

function uptime(){

}

function memInfo(){

}

function selfStat(){

}

function selfLimits(){

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
  '/proc/uptime': { uptime: uptime},
  '/proc/self/stat': { stat: selfStat },
  '/proc/self/limits': { limits: selfLimits }
};

module.exports = handlers;