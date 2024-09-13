import { AsyncLocalStorage } from 'node:async_hooks';


function main() {
    const asl1 = new AsyncLocalStorage();
    asl1.run({ id: 1}, () => {

         asl1.run({x:4}, () => {
            const ctx = asl1.getStore();
            ctx.v = 1;
            console.log('inner', asl1.getStore());
        })
        console.log('outer', asl1.getStore());
    })
}

main();