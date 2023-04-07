// *WRONG*
// const localProviderUrl = 'wss://localhost:8545'

// Result:
// 
// connection not open on send()
// Error in subscription wss://localhost:8545
// Error: connection not open
//     at WebsocketProvider.send (/Users/*/node_modules/web3-providers-ws/src/index.js:211:18)
//     at Timeout._onTimeout (/Users/*/node_modules/web3-providers-ws/src/index.js:196:19)
//     at ontimeout (timers.js:482:11)
//     at tryOnTimeout (timers.js:317:5)
//     at Timer.listOnTimeout (timers.js:277:5)


// *RIGHT* - use http protocol
const Web3 = require('web3')

const localProviderUrl = 'HTTP://127.0.0.1:7545';

// local
const localProvider = new Web3.providers.WebsocketProvider(localProviderUrl);
//console.log(localProvider);
const localWeb3 = new Web3(localProvider);
localWeb3.eth.subscribe('newBlockHeaders', (error: Error, result: unknown) => {
    if (error) {
        console.error('Error in subscription', localProviderUrl)
        console.error(error)
        return;
    }
    //console.error('success', localProviderUrl)
    console.log('>', result === localProviderUrl);

});