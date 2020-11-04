

// only get KernelPageSize and MMUPageSize
module.exports = function selfSmaps(text) {

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
  };
  