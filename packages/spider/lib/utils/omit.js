function omit (obj, ...names) {
    const stringNames = names.filter(n => typeof n === 'string');
    const regexps = names.filter(n => n instanceof RegExp);
    const fns = names.filter(n => n instanceof Function);
    const finalResult = {};
    const omitByStrings = Object.entries(obj).filter(([key]) => !stringNames.includes(key));
    const omitByRegExp = omitByStrings.filter(([key]) => !(regexps.filter(re => re.test(key)).length > 0));
    const omitByFunction = omitByRegExp.filter(([key]) => !fns.filter(fn => fn(key)).length > 0);
    omitByFunction.reduce((fin, [key, value]) => {
        fin[key] = value;
        return fin;
    }, finalResult);
    if (Object.getOwnPropertyNames(finalResult).length === 0) {
        return {}; // <- IT HAS TO BE THIS WAY, LOOK ABOVE!!!, return explicit {}
    }
    return finalResult;
}

module.exports = omit;