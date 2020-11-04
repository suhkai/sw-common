
module.exports = function cpuInfo(keys = [
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