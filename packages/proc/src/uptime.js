module.exports = function uptime(text) {
  const [system, idle] = text.split(/\s+/).filter(f => f).map(v => parseFloat(v));
  return {
    system,
    idle
  };
};
