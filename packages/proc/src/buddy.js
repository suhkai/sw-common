
module.exports = function buddyInfo(text) {
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