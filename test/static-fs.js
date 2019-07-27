const URL = require('url');
const {
    join,
    extname
} = require('path');
const fs = require('fs')
const crypto = require('crypto');
const status = require('http').STATUS_CODES;

const baseDir = process.argv[2]
const cwd = process.cwd();

function md5(data) {
    return crypto.createHash('md5').update(data).digest("base64");
}


const extCTMap = new Map([
    ['.html', 'text/html'],
    ['.js', 'application/javascript'],
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
    ['.svg', 'image/svg+xml'],
    ['.css', 'text/css']
]);

const etagMap = new Map();

function createHandler(options) {
    const root = join(cwd, baseDir)

    return function handler(req, res) {

        const {
            pathname
        } = URL.parse(req.url);

        console.log(`loading ${pathname}`);


        // is there an etag?
        let etag = req.headers['if-none-match'];
        const foundEtag = etagMap.get(etag);
        if (foundEtag) {
            const {
                expires
            } = foundEtag;
            res.setHeader('Expires', expires)
            res.setHeader('Etag', etag);
            res.setHeader('Cache-Control', `max-age=0`); // 10 minutes
            res.statusCode = 304;
            res.statusMessage = status[304];
            res.end();
            return;
        }
       

        // default?
        const finalURI = (pathname === '/' || pathname === undefined || !pathname) ? '/index.html' : pathname;
        // full path
        const file = join(root, finalURI);
        const ext = extname(file);
        const contentType = extCTMap.get(ext) || 'application/*';

        res.setHeader('Content-Type', contentType);

        let buffer;
        try {
            buffer = fs.readFileSync(file);
            res.statusCode = 200;
            res.statusMessage = status[200];
        } catch (err) {
            res.statusCode = 404;
            res.statusMessage = status[404];
            res.setHeader('Content-Type', 'text/html');
            buffer = '<html><head></head><body><div><p>404 not found</p></div></body>/html>';
        }

        etag = md5(buffer);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Etag', etag);

        const expires = new Date(Date.now() + 3600 * 24).toUTCString(); //24h
        res.setHeader('Expires', expires)
        res.setHeader('Cache-Control', `max-age=0`); // 10 minutes
        etagMap.set(etag, { expires });
        res.end(buffer);
    }
}

module.exports = createHandler;