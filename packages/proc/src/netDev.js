module.exports = function netDev(text) {
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
  };
  