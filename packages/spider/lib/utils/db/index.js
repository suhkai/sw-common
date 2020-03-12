const path = require('path');
const mkdirp = require('./mkdirp');
const inferFileType = require('./inferFileType');

module.exports = async function hydrate(basedir){
    // hydrate the storage or create an empty storage
    const fullPath  = path.resolve(basedir);   
    const type = inferFileType(fullPath);
    const [ok, error] = await mkdirp(fullPath, type);
    
};
