import { add } from './math';
import { resolve } from 'path';
let text: string = 'let should converted to var';
const map = new Map<number, string>();
console.log(resolve('./hello-world'));
console.log(text, map.entries(), add(1,2))