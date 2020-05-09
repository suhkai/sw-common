const http = require('http')


//'\uFEFF'
//'\uFFFE'

const server = http.createServer((req, resp) => {
    const body = '\uFEFF .hello { width: 10px }'
    resp.setHeader('Content-Type', 'text/css; charset=UTF-16LE')
    resp.setHeader('Content-Length', Buffer.byteLength(body));
    resp.end(body)
});

server.listen(8080);
