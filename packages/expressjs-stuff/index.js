var ws = require('ws')


var cookieSession = require('cookie-session')
var express = require('express')

var app = express()

require('express-ws')(app);

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
    name: 'session',
    keys: ['key1']
}))

app.get('/', function (req, res, next) {
    // Update views
    req.session.views = (req.session.views || 0) + 1

    // Write response
    res.end(req.session.views + ' views')
})

app.ws('/echo', function (ws, req) {
    ws.on('message', function (msg) {
        ws.send(msg);
    });
});

app.listen(3000)