// https://smee.io/htMIDHKp13x7JwV
const config = {
    appId: 'NTAyNTI=',
    clientId: 'SXYxLjc3MjIwMGNlMjgzOTU3M2U=',
    clientSecret:'ZjliZmEzMTAxYzhhOTgxMmE5MjE3NjU4OTE2MzI3MzJjZmNiNWI2Yw==',
    url: 'aHR0cHM6Ly9zbWVlLmlvL2h0TUlESEtwMTN4N0p3Vg=='
}
const fs= require('fs');
const jwt = require('jwt-simple');

const data = fs.readFileSync('./encoded.pem', { encoding: 'ascii' });
const privateKey = Buffer.from(data, 'base64').toString();

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

const payload = {
    iat: Math.trunc(Date.now()/1000),
    exp: Math.trunc(Date.now()/1000) + 10*600,
    iss: Buffer.from(config.appId,'base64').toString()
};

const token = jwt.encode(payload, privateKey);
const p2 = jwt.decode(token, privateKey);
console.log(token);


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



    