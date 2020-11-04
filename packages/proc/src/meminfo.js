
module.exports = function memInfo(text) {
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