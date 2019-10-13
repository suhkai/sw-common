module.exports = function isObject(o){
    return o !==null && typeof o === 'object' && !(o instanceof Array);
}