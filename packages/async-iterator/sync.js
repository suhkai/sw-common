
const EventEmitter = require('events');


function Synchronized(fn) {
    const msgBus = new EventEmitter();
    let mutex;
    let called = 0;
    let threadsWaiting = 0;
    return async function wrapper(...args) {
        do {
            if (mutex === undefined) {
                mutex = new Promise(resolve => {
                    msgBus.once('clear', resolve);
                    console.log(`Number of listener registered: ${msgBus.listenerCount('clear')}`)
                });
                called++;
                console.log(`calling function ${called}`);
                const result = await fn(...args);
                called--;
                mutex = undefined; // clear it, not afraid no JS Garbage collector, because some ppl are still waiting on it
                msgBus.emit('clear');
                return result;
            }
            threadsWaiting++;
            console.log(`waiting on mutex ${threadsWaiting}`);
            // do some debuggin here
            await mutex;
            threadsWaiting--;
        } while (true)
    }
};

async function simulateWork() {
    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    });
}

class TestClass {

    constructor() {
        this.doWork = this.doWork.bind(this);
        this.doWork = Synchronized(this.doWork);
    }
    async doWork() {
        console.log('doing work');
        await simulateWork();
        console.log('work done');
    };
}

async function init() {
    const test = new TestClass();
    // fire in parallel
    const promises = [];
    for (let i = 0; i < 10; i++) {
        promises.push(test.doWork());
    }
    await Promise.all(promises);
    console.log('all work done');
}


init();








