'use strict';
const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const mimeExtMaps = {
      ".html": "text/html",
      ".jpeg": "image/jpeg",
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".json": "application/json",
      ".js": "text/javascript",
      ".css": "text/css",
      ".webmanifest":"application/manifest+json"
};
 
const port = process.argv[2] || 8888;

//-- createMiddleware, root
// use (pattern, handlerId, handler)
// pattern -> handlerId (can be several 1:n)
// handler-id -> handler

function createMiddleWare( onError, notFound){
  return {
    use(pathOrExp, handle){

    },
    remove(pathOrExp, handle){

    }
  }
}


const server = http.createServer((request, response) => {
  const uparts = url.parse(request.url);
  console.log(request.url);
  console.log(JSON.stringify(uparts));
  response.writeHead(200, {'Content-Type':'text/html'});
  response.end();
});
 
function getPort(){
  const p1 = parseInt(process.env.port, 10);
  if (Number.isFinite(p1)&& p1 > 1024 && p1 < 32000){
    return p1;
  }
  return 8080;
}

server.listen(getPort(),function (){
  console.log(`Listening on: ${this._connectionKey}`)
});


