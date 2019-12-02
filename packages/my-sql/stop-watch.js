


module.exports = function createStopWatch(){
    let start = Date.now();

    return {
        peek(){        
            return Date.now() - start;
        },
        reset(){
            start = Date.now();
        }
    };
}