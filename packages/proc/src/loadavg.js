module.exports = 
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
};
