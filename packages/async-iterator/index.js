const myAsyncIterable = new Object();

function delay(ts){
    return new Promise(resolve => {
        setTimeout(()=>resolve(ts), ts);
    });
}


myAsyncIterable[Symbol.asyncIterator] = async function*(msgBus) {
    let sink;
    yield "hello";
    sink = await delay(3000);  // these delays seem to work
    yield "async";
    sink = await delay(3000)
    yield "iteration!";
    sink = await delay(3000);
};

(async () => {
    for await (const x of myAsyncIterable) {
        console.log(x);
        // expected output:
        //    "hello"
        //    "async"
        //    "iteration!"
    }
    console.log('done');
})();