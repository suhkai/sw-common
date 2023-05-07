import { InfuraProvider, Wallet } from 'ethers';

const PRIVATE_KEY =
    '46cfd416b45c2c443a5a6929fc75e1d3183ec3ea0a45494907fc92eed0bda9a2';

async function main() {
    const provider = new InfuraProvider(
        'sepolia',
        '2d3c2c67fe16457b94f4b11531bd72fc'
    );
    const wallet = new Wallet(PRIVATE_KEY, provider);
    const walletAddress = wallet.address;
    const walletAddress2 = await wallet.getAddress();
    const nonce = await wallet.getNonce();
    const network = await provider.getNetwork();
    const block = await provider.getBlock('latest');
    const chainId = network.chainId;
    const time = block?.timestamp
        ? new Date(block.timestamp * 1000)
        : new Date();

    console.log({
        walletAddress,
        walletAddress2,
        chainId,
        nonce,
        number: block?.number,
        time: time.toLocaleTimeString(),
        signingKeyPrivateKey: wallet.signingKey.privateKey,
        signingKeyPublicKey: wallet.signingKey.publicKey,
    });

    // ethers.utils
}

main().catch(console.log);
