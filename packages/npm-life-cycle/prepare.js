const fs = require('fs');
const path = require('path');

// get current working dir

const cwd = path.resolve('./');

const stream = fs.createWriteStream(path.join(cwd, "datafile.txt"));
stream.setDefaultEncoding('utf8');

stream.on('error', err => {
    console.log(err)
});

stream.on('finish',()=>{
    console.log('/event/finished');
})

stream.on('close', ()=>{
    console.log('/event/close');
});

stream.write('hello,');
stream.write('world!');

stream.end();

console.log("Prepare has been executed");