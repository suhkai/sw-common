
const esc = String.fromCharCode(0x1B);
const csi = '[';
const osc = ']';


const data1 = [
    esc,
    csi
]

const data2 = [
    esc,
    osc
]

const reset = [
    esc,
    csi,
    '0'
].join('')

const moveCursor = [
    esc,
    csi,
    '10GPrintSomething'
].join('')

console.log(reset);
console.log(moveCursor)
console.log('hello')