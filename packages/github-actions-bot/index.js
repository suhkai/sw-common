// https://smee.io/htMIDHKp13x7JwV
const config = {
    appId: 'NTAyNTI=',
    clientId: 'SXYxLjc3MjIwMGNlMjgzOTU3M2U=',
    clientSecret:'ZjliZmEzMTAxYzhhOTgxMmE5MjE3NjU4OTE2MzI3MzJjZmNiNWI2Yw==',
    url: 'aHR0cHM6Ly9zbWVlLmlvL2h0TUlESEtwMTN4N0p3Vg=='
}

const fs= require('fs');
const jwt2 = require('jsonwebtoken');

function readKeyFromFile(){
    const data  = fs.readFileSync('./encoded.pem', { encoding: 'ascii' });  // rsa private key
    const privateKey = Buffer.from(data, 'base64').toString();
    return privateKey;
}

const pKey = readKeyFromFile();
// lookup "6.3.  Parameters for RSA Keys" at https://tools.ietf.org/html/rfc7518#section-6.3
console.log(pKey);

const url = Buffer.from(config.url, 'base64').toString();
const SmeeClient = require('smee-client');

const smee = new SmeeClient({
    source: url,
    target: 'http://localhost:3000/events',
    logger: console
})

const events = smee.start() // will forward to target
process.on('SIGINT', (code) => {
    //console.log('SIGINT will exit');
    process.exit();
});

function base64from(str){
    return Buffer.from(str,'base64').toString();
}

const payload = {
    iat: Math.trunc(Date.now()/1000),
    exp: Math.trunc(Date.now()/1000) + 600,
    iss: Buffer.from(config.appId,'base64').toString(),
    aud: base64from(config.clientId)
};



const token = jwt2.sign(payload, pKey, {
    algorithm: 'RS256',
   // audience: decodedClientId
});

console.log(token.split('.').slice(0,2).map(base64from));


console.log(`curl -i -H "Authorization: Bearer ${token}" -H "Accept: application/vnd.github.machine-man-preview+json" https://api.github.com/app`)

// use https://github.com/octokit/rest.js (octokit js client?)
//https://octokit.github.io/rest.js/#authentication

// need to authenticate via JWT
/*
{
    "alg": "HS256",
    "typ": "JWT",
    "sub": "1234567890",
    "name": "John Doe",
    "admin": true
}
*/

// curl -i -H "Authorization: Bearer YOUR_JWT" -H "Accept: application/vnd.github.machine-man-preview+json" https://api.github.com/app

// test it https://developer.github.com/v3/apps/






    