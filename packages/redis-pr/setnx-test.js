const redis = require('redis');

const client = redis.createClient();


function defer(fn, ts){
    if (ts && ts  > 0){
        setTimeout(fn,ts);
        return;
    }
    Promise.resolve().then(()=>fn())
}


client.on("error", function(error) {
    console.error(`/event/error was fired: ${error}`);
});

client.on('ready', init)

function init(){

const crCom = cl => command => (key , value, expire, lock = false, cb) => {
    const args = [key];
    if (value){
        args.push(value)
    }
    if (lock){
        args.push('NX');
    }
    if (typeof expire === 'number' && expire > 0){
        args.splice(args.length,0,'PX', expire);
    }
    if (cb){
        args.push(cb);
    }
    return cl[command].apply(cl, args);
}

defer(()=>{
    const cl = crCom(client);
    const get = cl('get');
    const set = cl('set');

    set("key1", 'v1', 5000, true, (err, ...data) => {
        if (err){
            console.error(`set returned error 1st try:${JSON.stringify(err)}`);
            return;
        }
        console.log(`set response 1st try: ${JSON.stringify(data)}`);
        // local imediatly again
        defer(()=>{
            set("key1", "v2", 4000, true, (err2, ...data2) => {
                if (err2){
                    console.error(`set returned error 2nd try:${JSON.stringify(err2)}`);
                    return;
                }
                console.log(`set response 2nd try: ${JSON.stringify(data2)}`);
                defer(() =>{
                    get('key1',undefined, undefined, undefined, (err2, data2)=>{
                       console.error(`get returned error:${JSON.stringify(err2)}`);
                       console.log(`get response: ${JSON.stringify(data2)}`);
                    });
                });
            });
        }, 1000);
    });
});
}