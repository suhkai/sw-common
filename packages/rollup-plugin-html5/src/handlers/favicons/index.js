const validateOptions = require('./validator');

module.exports = function(directory, reserveOptions){
    
    directory.reserveOptions('@internal-favicons', ['favicon']);

    const rc = {
        validateOptions,
        generateAssets,
        postProcessing
    };
    return rc;
}