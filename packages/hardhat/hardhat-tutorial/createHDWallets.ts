import { wordlists, Mnemonic, Wallet, HDNodeWallet } from 'ethers';
import { webcrypto } from 'node:crypto';

function* seq(count: number) {
    for (let i = 0; i < count; i++) {
        yield i;
    }
    return count;
}

function get256RandomBits() {
    //32*8 = 256 bits
    return webcrypto.getRandomValues(new Uint8Array(32));
}

function bin2Hex(data: Uint8Array): string {
    return Array.from(data)
        .map((e) => e.toString(16).padStart(2, '0'))
        .join('');
}

function entropyExperiments() {
    // create entropy for the initial wordlist
    const entropy = get256RandomBits();

    // set password argument to "null"
    const mnemonic = Mnemonic.fromEntropy(entropy, null, wordlists.en);
    const phrase = mnemonic.phrase;
    const seed = mnemonic.computeSeed();
    console.log('entropy:', bin2Hex(entropy));
    console.log('entropy -> phrase is:', phrase);
    console.log('entropy -> seed is:', seed);

    // backwards to from phrase to seed
    const inferredMnemonic = Mnemonic.fromPhrase(phrase, null, wordlists.en);
    const inferredSeed = inferredMnemonic.computeSeed();
    const inferredEntropy = Mnemonic.phraseToEntropy(phrase);

    console.log('phrase -> seed:', inferredSeed);
    console.log('phrase -> entropy:', inferredEntropy);
}
const ganachePhrase =
    'magic fix gasp poet use napkin speed winner thing turn ketchup excuse';

function hierarchyWallets() {
    // ganacha phrase:

    const parent = HDNodeWallet.fromPhrase(
        ganachePhrase,
        undefined,
        //default: "m/44'/60'/0'/0/0"
        "m/44'/60'/0'/0" // one 0 shorter then above
    );

    console.log(
        `seed from ganach passphrase: ${parent.mnemonic?.computeSeed()}`
    );

    console.log(`entropy from ganach passphrase: ${parent.mnemonic?.entropy}`);

    console.log(`parent path and depth: ${parent.path}, ${parent.depth}`);

    // derive all nine ganach accounts
    for (const i of seq(10)) {
        const account = parent.deriveChild(i);
        console.log('');
        console.log(
            `address ${String.prototype.padStart.call(i, 2, '0')}: ${
                account.address
            }, depth:${account.depth}`
        );
    }
}

function usingNormalWallet() {
    // "normal" wallets
    const prefix = '[using Wallet.fromPhrase]';
    const wallet = Wallet.fromPhrase(ganachePhrase);
    console.log(`${prefix} wallet.path:${wallet.path}`);
    console.log(`${prefix} wallet.address: ${wallet.address}`);
    console.log(`${prefix} wallet.depth: ${wallet.depth}`);
}

entropyExperiments();
hierarchyWallets();
usingNormalWallet();
