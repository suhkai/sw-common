module.exports = function handlerRegistry(){
    const optionRegistry = new Map();
    const handlers = new Map();

    return Object.freeze({
        registerOptions(handlerName, options){
            if (!Array.isArray(options)){
                throw
            }

        }
    });
}

