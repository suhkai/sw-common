import { ethers } from 'hardhat';

async function main() {
    const wallets = await ethers.getSigners();
    console.log('nr wallets', wallets.length);
    //console.log(
    //    'wallets:',
    //    (await wallets).map((w) => w.address).join(',\n\t')
    //);
    const provider = new ethers.providers.InfuraProvider(
        'sepolia',
        '2d3c2c67fe16457b94f4b11531bd72fc'
    );

    console.log(await provider.getBlockNumber());
    const block = await provider.getBlock('latest');
    console.log('blocknr:', block.number);
    console.log(
        'timestamp:',
        block.timestamp,
        new Date(Number(block.timestamp) * 1000).toString()
    );
    console.log('hash:', block.hash);

    //const { number, timestamp } = block;
    //console.log('number transactions:', block.transactions.length);
    //console.log('latest minted block:', { number, timestamp });
    //console.log('block:', block);
}

main().catch(console.log);
