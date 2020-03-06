
function absorbSection(lines, cursor) {
    const errors = []; 
    const rc = {};
    // the first line is a header
    let i;
    for (i = 0; i < lines[cursor].length && lines[cursor][i] === '['; i++);
    const start = i;
    for (i = lines[cursor].length - 1 && lines[cursor][i] === ']'; i >= 0; i--);
    const end = i;
    const sectionName = lines[cursor].slice(start, end + 1);
    cursor++;
    while (cursor < lines[cursor].length){
        const line = lines[cursor];
        if (line[0] === '#'){
            cursor++;
            continue;
        }
        if (line[0] === '['){
            break;
        }
        // process kv pair
        const splitIdx = line.indexOf('=');
        if (splitIdx === -1){
            errors.push(`error on line ${cursor} no "=" seperator`);
            cursor++;
            continue;
        }
        const key = line.splice(0, splitIdx);
        const value = line.splice(splitIdx+1);
        rc[key]=value
        cursor++;
    }
    return [{ [sectionName]: rc }, cursor ,errors];
}

module.exports = function lexer(str) {
    const lines = str.split('\n').map(line => line.replace(/[\x01-\x1f]/, '').trim());
    let cursor = 0;
    const gerrors = [];
    const rc = {};
    while (cursor < line.length) {
        if (lines[cursor][0] === '#') { // comments
            cursor++;
            continue;
        }
        if (lines[cursor][0] === '[') {
            const [data, i, errors]  = absorbSection(lines, cursor);
            gerrors.push(...errors);
            Object.assign(rc, data);
            cursor = i;
            continue;
        }
        gerrors.push(`error on line ${curosr}, its not part of a section`);
    }
    return [rc, gerrors.join('\n')];
};
