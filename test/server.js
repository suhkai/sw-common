const https = require('https');
const fs = require('fs');
const URL = require('url');

const createHandler = require('./static-fs');


const options = {
    key: fs.readFileSync(require.resolve('./cryptokeys/mobile.superalgos.org.key')),
    cert: fs.readFileSync(require.resolve('./cryptokeys/mobile.superalgos.org.crt'))
};

const server = https.createServer(options)
const http = require('http');

const handler = createHandler();
server.on('request', handler);

const port = 443
server.listen(port, () => {
    console.log(`serving files on ${port}`)
});

http.createServer(function (req, res) {
        const url = URL.parse(req.url);
        console.log(url);   
        url.protocol = 'https:';
        url.hostname = url.hostname || req.headers.host;
        console.log('REDIRECT', URL.format(url) );
        res.writeHead(301, {Location: URL.format(url) });
        res.end();

}).listen(80, () => console.log('redirect active on port 80 -> 443'));
