import { config as configDotEnv } from 'dotenv';
configDotEnv();

import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const SEPOLIA_PRIVATE_KEY2 = process.env.SEPOLIA_PRIVATE_KEY2;
// console.log({ INFURA_API_KEY, SEPOLIA_PRIVATE_KEY, SEPOLIA_PRIVATE_KEY2 });

const config = {
    solidity: '0.8.18',
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [SEPOLIA_PRIVATE_KEY, SEPOLIA_PRIVATE_KEY2],
        },
    },
};
/** @type import('hardhat/config').HardhatUserConfig */
export default config;
