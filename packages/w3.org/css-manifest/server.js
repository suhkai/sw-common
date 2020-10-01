'use strict';

const express = require('express');
const mimes = require('mime-types');
const app = express();

app.use(
  express.static('public',{
    dotfiles:'allow',
    etag: true,
    extensions: ['html','htm'],
    fallthrough: false,
    immutable: false,
    index:"index.html",
    redirect: true,
    setHeaders(res,path, stat){ // handle headers here for each file
      if (path.endsWith('manifest.json')){
        const mime = mimes.lookup('.webmanifest');
        res.setHeader('Content-Type',mime);
      }
    }
  }
));

const port = process.argv[2] || 8888;

function getPort(){
  const p1 = parseInt(process.env.port, 10);
  if (Number.isFinite(p1)&& p1 > 1024 && p1 < 32000){
    return p1;
  }
  return 8080;
}

app.listen(getPort(),function (){
  console.log(`Listening on: ${this._connectionKey}`)
});


