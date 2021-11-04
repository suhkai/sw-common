
async function hello(){
    async function* add(a: number, b: number) {
        yield a + b;
    }
    const it = add(1,2);
    console.log(await it.next(), await it.next());
}

hello();