import { ethers } from 'ethers';
import { webcrypto } from 'node:crypto';

function getPrivateKey(): string {
    const u8 = new Uint8Array(32);
    const privateKey = webcrypto.getRandomValues(u8);
    return Array.from(u8)
        .map((e) => e.toString(16).padStart(2, '0'))
        .join('');
}

const privateKey = getPrivateKey();
const wallet = new ethers.Wallet('0x' + privateKey);

console.log('private key:', privateKey);
console.log('public (wallet) address:', wallet.address);
