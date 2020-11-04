
module.exports = function selfStatm(text) {
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
  };
  