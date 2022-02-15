//const http = require('http');
const express= require('express');
const cookie_parser = require('cookie-parser');

const app = express();
const port = 3000
app.use(cookie_parser());

// order of registration of middel-ware matters

app.get('*', (req, res, next) => {
    console.log('app.get("*") fired');
    next();
});

app.post('*', (req, res, next) => {
    console.log('app.post("*") fired');
    next();
});

app.get('/', (req, res, next) => {
    res.send('Hello Multiverse!');
    console.log('app.get("/")');
    next();
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

