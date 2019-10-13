module.exports = function(i){
    return typeof i === 'number' && i >= 0 && Number.isInteger(i);
}