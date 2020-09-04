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

const prepCL = cl => command => subcommand => cb => {
    const args = [];
    if (subcommand){
        args.push(subcommand);
    }
    if (cb){
        args.push(cb);
    }
    return cl[command].apply(cl, args);
}

defer(()=>{
    const cl = prepCL(client);
    const clList = cl('client')('list');
    
    clList((err, ...data) => {
        if (err){
            console.error(`set returned error 1st try:${JSON.stringify(err)}`);
            return;
        }
        console.log(`set response 1st try: ${JSON.stringify(data)}`);
    });
});
}