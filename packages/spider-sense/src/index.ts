import * as https from 'https';

const url = 'xyz';


const clientRequest = https.request(url, {
    timeout: 3000
});

clientRequest.on('abort', function() {
    console.log(`abort: ${JSON.stringify(arguments)}`);
});

clientRequest.on('continue', function() {
    console.log(`continue: ${JSON.stringify(arguments)}`);
});

clientRequest.on('information', function() {
    console.log(`information: ${JSON.stringify(arguments)}`);
});

clientRequest.on('response', im => {
    console.log(im.headers);
    console.log(im.rawHeaders);
    console.log('method:',im.method);
    console.log('rawtrailers:',im.rawTrailers);
    console.log('statusCode:',im.statusCode);
    console.log('statusMessage:',im.statusMessage);
    console.log('trailers:',im.trailers);
    console.log('complete',im.complete);
    console.log('3');
    console.log(im.headers['content-length']);
   
   
});
