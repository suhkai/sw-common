import R from 'ramda';

console.log('[LIST]/adjust-------');

console.log(R.adjust(2, (n: number) => n * 2, [9, 7, 5]));
{
    const newFn = R.adjust(2, (n: number) => n * 2);
    console.log(newFn([2, 3, 9]));
}

console.log('[LIST]/all-------');

//R.all is the same Array.prototype.every

console.log(R.all(R.equals(3), [1, 2, 3]));
console.log(R.all(R.equals(3), [3, 3, 3]));
console.log([3, 3, 3].every((i) => i == 3));

// R.any, this is the same as "Array.prototype.some"

console.log('[LIST]/any----------');
console.log(R.any((i) => i > 4, [1, 2, 3, 4, 5]));

console.log('[LIST]/aperture----------');
console.log(R.any((i) => i > 4, [1, 2, 3, 4, 5]));

console.log('[LIST]/append-------------------');
console.log(R.append('tests', ['write', 'more']));
//
console.log('[LIST]/chain also known as Array.prototype.flatMap-------');
{
    function test(a: number): [number, number, number] {
        return [a, a, a];
    }
    console.log(R.chain(test, [1, 2]));

    console.log([1, 2].flatMap(test));
}

//
// https://ramdajs.com/docs/#map
// map
function double(x: number): number {
    console.log(`arguments:${Array.from(arguments)}`);
    return x * 2;
}
const doDouble = R.map(double);

// I swear this does not exist in Rambda, weird shit

const digits: string[] = ['1', '2', '3', '4'];
const appender = (a: string, b: string): [string, string] => [a + b, a + b];

console.log(R.mapAccum(appender, '0', digits));

//
