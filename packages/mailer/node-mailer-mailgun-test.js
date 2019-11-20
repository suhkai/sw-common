"use strict";
const fs = require('fs');
const path = require('path');
const nodemailer = require("nodemailer");
var mg = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
    auth: {
        api_key: 'key-b0e9cbf005f98d0f2b0649f8b292045a',
        domain: 'mail.jacob-bogers.com'
    }
};

function createTestAccount() {
    return new Promise(resolve => {
        nodemailer.createTestAccount((err, testAccount) => {
            if (err) {
                resolve([undefined, err]);
                return;
            }
            resolve([testAccount, undefined]);
        });
    })
}

function createTransportEthereal(testAccount){
    
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });

    return function sendMailer(options){
        return new Promise(resolve => {
            transporter.sendMail(options,(err, info)=>{
                // anatomy of info object
                /*
                  x  messageId: pl of message
                    envelope: envelope of object
                    accepted:
                    rejected:
                    pending:
                    response:
                    // mailgun specific
                    id
                    message
                */
                if (err){
                    resolve([undefined, err]);
                    return;
                }
                resolve([info, undefined]);
            });
        });
    };
}

async function testEthereal() {
    const [testAccount, error] = await createTestAccount();
    if (error){
        console.error(error);
        return;
    }
    const sendMail = createTransportEthereal(testAccount);

    const [info, error2] = await sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
    });
    error && console.error(error2);
    info && console.log(info)
}

function init() {

    // read some file
    const contentFile1 = fs.readFileSync(path.resolve('./files/pics462.jpg'));
    const nodemailerMailgun = nodemailer.createTransport(mg(auth));
    const result = nodemailerMailgun.sendMail({
        from: [{ name: 'Santa Claus', address: 'myemail@example.com' }],
        to: [{
            name: 'Jacob Bogers',
            address: 'jkfbogers@gmail.com'
        }], // An array if you have multiple recipients.
        //cc: 'second@domain.com',
        //bcc: 'secretagent@company.gov',
        subject: 'Hey you, awesome!',
        'h:Reply-To': 'reply2this@mail.jacob-bogers.com',
        //You can use "html:" to send HTML email content. It's magic!
        html: '<h1>Wow Big powerful letters</h1>',
        //You can use "text:" to send plain-text content. It's oldschool!
        text: 'Mailgun rocks, pow pow!',
        attachments: [
            {
                filename: 'simepic.png',
                content: contentFile1
            },
            {
                filename: 'index.html',
                content: '<a href="some-link">hello world</a>',
                encoding: 'utf8'
            }
        ]
    }, (err, info) => {
        if (err) {
            console.error(`there was an error ${String(err)}`);
        }
        if (info) {
            console.log(`We received info object: ${JSON.stringify(info)}`);
        }
    });
    console.log('result=', result);
}

init();

//testEthereal();

/*
step1:

const transporter = nodemailer.createTransport(options);

const options = {
    port,
    host,
    auth: {
        type,
        user,
        pass,
    },
    authMethod,
    // pooling
    pool: true/false // pooled smtp
    maxConnections: // max socket connections
    maxMessagges; (max messages per single connection)
    rateDelta: rate limiting (in ms, aka 1000ms is 1s)
    rateLimit: limits the amount messages sent in "rateDelta" time period
};


message object: {
    from:
    to:
    envelope: { // only for smtp ???
        from:
        to:
        cc:
        bcc:
    }
}

// methods

transporter.isIdle() is there any connection that is idle (pooling)
transporter.close() -- clean up connection (only idle ones or all connections?)

event
'idle': > if the one of the connections is idle


testing smtp, built in support for ethereal email <a href="https://ethereal.email" class="highlight">Ethereal Email</a>

// create testing account on the fly

nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass  // generated ethereal password
        }
    });
});


// message configuration
- from
- to
- cc
- bcc
- subject
- text
- html
- attachments
    - filename
    - content
    - path
    - href
    - httpHeaders
    - contentType
    - contentDisposition
    - cid
    - encoding, base64, hex, binary,
    - headers -custom headers
    - raw

// example attachments
 [
     {
         folename: 'text.txt',
         content: 'hello world'
     },
     {
         filename: 'text2.txt',
         path: '/path/to/file.txt' // stream this file
     },
     {
         filename: 'text3.txt',
         contentType: 'text/plain'
         content: readable  (readableStream)
     },
     {
         filename: 'license.txt',
         path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
     },
     {
         path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
     },
     {
         raw: 'Content-Type: text/plain\r\n' +
                 'Content-Disposition: attachment;\r\n' +
                 '\r\n' +
                 'Hello world!'
     }
 ]
   .
   .
   continue with "message"
   // Routing options
   - sender
   - replyTo
   - inReplyTo
   - references
   - envelope
   // Content options
   - attachDataUrls
   - watchHTML (for the apple watch)
   - amp (AMP4EMAIL validate here (https://validator.ampproject.org/#htmlFormat=AMP4EMAIL)
   // calenders
   - icalEvent {
        -method
        -filename
        -content
        -path
        -href
        -encoding
    
   - alternatives  
   - encoding
   - raw
   - textEncoding 'base64' 
   - priority
   - headers: { 'X-Key-Name': 'key value', .... } or array of such things
   - messageId (i not set gets random value)
   - date will be set if not set
   - list -> list of 'List-*' headers {
       help:
       unsubscribe: {
           url:
           comment:
       }
       subscribe: [
           string,
           {
               url:
               comment:
           }
       ],
       post: [
           [
               string,
               {
                   url:
                   comment:
               }
           ]
       ]
   }
   // security options
   disableFileAccess: true // dont allow files as content
   disableUrlAccess: true // dont allow url to be used as content


   // Address object
   examples
   'foobar@example.com'
   'Ноде Майлер <foobar@example.com>'
   {
        name: 'Майлер, Ноде',
        address: 'foobar@example.com'
   }
 
   // can also be mixed
    [
        'foobar@example.com',
        {
            name: 'Майлер, Ноде',
            address: 'foobar@example.com'
        }
    ]

    // alternatives
    alternatives: [
        {
            contentType: 'text/x-web-markdown',
            content: '**Hello world!**'
        }
    ]

    // custom source
    let message = {
         raw: {
            path: '/path/to/message.eml' // will be read from file
        }
    };

   // SMTP transports
   single connection , no pools
   allow secure, allow selfsigning
   allow login, (not oauth2)
   verify smtp connection
   allow proxy support
   dsn (delivery notifications, delivered, undelivered, delayed) for later

   -- other transports parked for later use, now only do smtp
     
   check options for transports here https://nodemailer.com/transports/

    plugins
      - plugins that operate on the mail object (pre-processing)
      - plugins operate on the mail stream (processing)
      - plugins operating on transport (transport plugins)

      html plugins (hanlebars)
      inline-base64 (cid -referenced attachments)
      html-text ()
      DKIM signing later enabled. https://nodemailer.com/dkim/
*/

