function handler(options){
    
    return {
        name: 'must be unique name',
        initialize(){
            // maybe set up a db or whatever
        },
        test(url, inferred_headers){
        
        },
        createStorageName(url, headers){

        },
        * processAsset(url, headers, data, dest){ // yield urls where  you need to 
            yield { url, headers }; // yield new headers
            // dest is outputStream to write data too
        },
        finalize(){ // can emit to rollup as file

        }
    }
}


