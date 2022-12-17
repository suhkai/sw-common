blender tutorials
https://www.youtube.com/@LevelPixelLevel/videos
https://www.youtube.com/@TheRoyalSkies/playlists


// https://hackernoon.com/building-and-publishing-a-module-with-typescript-and-rollup-js-faa778c85396
// ^this one looks good
// following https://github.com/Microsoft/TypeScript-Babel-Starter#using-rollup
// for css
// https://lengstorf.com/learn-rollup-css/
// https://github.com/borodean/postcss-assets

Nice:
Using a rollup plugin to generate a html resource

https://gitlab.com/thekelvinliu/rollup-plugin-static-site

make a simple html plugin

htmlwebpack plugins (sub plugins)

-- webpack-subresource-integrity
https://www.npmjs.com/package/webpack-subresource-integrity

subresource integrety https://www.w3.org/TR/SRI/ (integrity attribute??)

-- appcache-webpack-plugin
this is the old appcache PWA feature (application Cache under devtools)

-- favicons-webpack-plugin

https://github.com/jantimon/favicons-webpack-plugin

has wonderfull html injection
Note: html-webpack-plugin must come before favicons-webpack-plugin in the plugins array.
path to logo can be relative, absolute path (from //) or node module resolution path (no / or ./ as part of the name)

https://github.com/jantimon/favicons-webpack-plugin#advanced-usage

under the hood uses https://github.com/itgalaxy/favicons (node module)
// wonderfull i can use this to make manifest.json files)))


-- html-webpack-harddisk-plugin
doesnt seem usefull 
WAIT, i see multi use of HTMLWebpackplugin to generate seperate html files, with diff configurations
and (alwaysWriteToDisk: true)
https://github.com/jantimon/html-webpack-harddisk-plugin#basic-usage


-- html-webpack-inline-source-plugin

embed jss and css inline (wut?)

-- html-webpack-inline-svg-plugin  
can make sense maybe, dont know))

-- html-webpack-inline-svg-plugin  

-- html-webpack-exclude-assets-plugin
    exclude assets from the html-webpack -plgn
    exclude assets by adding property "excudeAssets":[...] 

-- html-webpack-tags-plugin
    you could be copying assets outside the html build pipeline into the output dir
    with this plugin you can inject the tags manually
    new HtmlWebpackTagsPlugin({ tags: ['a.js', 'b.css'], append: true })

-- html-webpack-injector
    Suppose you want have `2 chunks` that you want to inject in the html document using HtmlWebpackPlugin.
    If you want to inject `one chunk in head` and `one chunk in body` of the same html document
    (uses the "_head" suffix in the "entry" props to designate head or body injection

### resource-hints-webpack-plugin
    
See [w3c](https://www.w3.org/TR/resource-hints/).

Example:

```html
<link rel="prefetch" href="//example.com/next-page.html" as="document" crossorigin="use-credentials">
<link rel="prefetch" href="/library.js" as="script">    
```

It adds automatically resource-hints to your html files to improve your load time.
    
```javascript
    plugins: [
        new HtmlWebpackPlugin({
            prefetch: ['**/*.*'],
            preload: ['**/*.*']
        }),
        new ResourceHintWebpackPlugin()
    ]
```

### preload-webpack-plugin

See [w3c](https://w3c.github.io/preload/).

Takes routes you code plit and preloads them using `<link rel="preload" as="script" ..>` or prefetch `<link rel="prefetch" as="script" ..>`


### link-media-html-webpack-plugin

Allows for injected stylesheet <link /> tags to have their media attribute set.

Example: 
```html
<link ... media="(min-width: 700px), handheld and (orientation: landscape)" />
```

### inline-chunk-manifest-html-webpack-plugin

Script tag to assign global webpack manifest variable, injected in `<head>`

Example:
```html
<head>
  <script>window.webpackManifest={"0":"0.bcca8d49c0f671a4afb6.dev.js","1":"1.6617d1b992b44b0996dc.dev.js"}</script>
</head>
```

### html-webpack-inline-style-plugin

For inlining styles using [juice](https://github.com/Automattic/juice)

### html-webpack-exclude-empty-assets-plugin

Will exclude empty assets from injection into hmtl (solves some issues with webpack 4.0)


### webpack-concat-plugin

Concat js and inject it into the html

### html-webpack-link-type-plugin 

for compatibility with "strict mode".

add `type` attribute to your <link.. > based on the emitted file extension

this means `<link ...>` is equal to `<script>` if `<link type="application/javascript" />`

[link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#HTML_Attributes) as following attribs:

### csp-html-webpack-plugin

- More [csp](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) info.
- List of [options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy).

### webpack-nomodule-plugin

Assigns the `nodmodule` attribute to script tags injected by Html Webpack Plugin

```javascript
plugins: [
     .
     .
     ,
     new WebpackNoModulePlugin({
            filePatterns: ['polyfill.**.js']
     })
]
```

## dom parsing

https://www.npmjs.com/package/xmldom
https://www.npmjs.com/package/jsdom
https://www.npmjs.com/package/parse5   <-- seems to be enough also "cleans" html a bit

tidy html

https://www.npmjs.com/package/libtidy-updated
https://github.com/htacg/tidy-html5


LoaderOptionsPlugin
webpack-node-externals
extract-text-webpack-plugin
clean-webpack-plugin

https://github.com/kangax/html-minifier (minimies html)


vector clock, state synchronisation
https://towardsdatascience.com/understanding-lamport-timestamps-with-pythons-multiprocessing-library-12a6427881c6


p4d = require('parse5/lib/tree-adapters/default');

```javascript
parse5('<html></html>'); // or parse5('')

//->
```

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="ie=edge" http-equiv="x-ua-compatible">
    <base href="https://example.com">
    <title>this is the title</title>
    <link href="myfavicon.ico" rel="shortcut icon" />
    <meta content="width=device-width,initial-scale=1" name="viewport">
    <meta name="name" content="description" />
    <meta name="content"
        content="Rogue game, Quest for Dungeon remake in HTML5" />
    <link rel="shortcut icon" href="myfavicon.ico" />
</head>

<body>
    <div id="app"> </div>
    <script src="main.js" type="text/javascript"></script>
    <script type="text/javascript" src="main.js"></script>
</body>

</html>
```

```javascript
//<!doctype html>
 { nodeName: '#documentType',
       name: 'html',
       publicId: '',
       systemId: '',
       parentNode: [Circular] }
```

```javascript
//p5.parse('')
{ nodeName: '#document',
  mode: 'quirks',
  childNodes:
   [ { nodeName: 'html',
       tagName: 'html',
       attrs: [],
       namespaceURI: 'http://www.w3.org/1999/xhtml',
       childNodes: [Array],
       parentNode: [Circular] } ] }

//p5.parse('<!doctype html><html></html>')
{ nodeName: '#document',
  mode: 'no-quirks',
  childNodes:
   [ { nodeName: '#documentType', //<!doctype html>
       name: 'html',
       publicId: '',
       systemId: '',
       parentNode: [Circular] },
     { nodeName: 'html',
       tagName: 'html',
       attrs: [],
       namespaceURI: 'http://www.w3.org/1999/xhtml',
       childNodes: [Array],
       parentNode: [Circular] } ] }
```

## What is a systemID

```javascript
p5.parse('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0//EN" "http://www.w3.org/TR/REC-html40/strict.dtd">')
{ nodeName: '#document',
  mode: 'no-quirks',
  childNodes:
   [ { nodeName: '#documentType',
       name: 'html',
       publicId: '-//W3C//DTD HTML 4.0//EN', // first part
       systemId: 'http://www.w3.org/TR/REC-html40/strict.dtd', // second part
       parentNode: [Circular] },
     { nodeName: 'html',
       tagName: 'html',
       attrs: [],
       namespaceURI: 'http://www.w3.org/1999/xhtml',
       childNodes: [Array],
       parentNode: [Circular] } ] }
```

function unsetParentNode(ast){
    if (ast.childNodes){
        for (const elt of ast.childNodes){
            if (elt.parentNode){
                elt.parentNode = ''
            };
            unsetParentNode(elt);
        }
    }
}

createDocument
createDocumentFragment 
createElement (tagName, namespaceUri, attr)
createTexNode
createCommentNode
appendChild
insertBefore
setTemplateContent
getTemplateContent
setDocumentType
detachNode
insertText
insertTextBefore
adoptAttributes
getFirstChild
getChildNodes
getParentNode
getAttrList
getTextNodeContent 

isTextNode 
isDocumentTypeNode 
isElementNode 

adoptAttributes()
insertTextBefore()
insertText() ("merges" text nodes)
detachNode(node) // detaches the "node" from its parent
getDocumentMode(mode) // quircks no


<div class="front_clip"><div class="ring_clip"></div></div>


ta = require('parse5/lib/tree-adapters/default');
html = require('parse5/lib/common/html');


// create validator
// simple validation,
// string

// - string, value needs to be a string
// - string[] value needs to be an array of strings
// - string{10,15} value needs to be a string minWidth=10, maxWidth=15
// - string{10,} or string{10, Infinity} value needs to be a string minWidth=10
// - string{,15} value needs to be a string maxWidth=15
// - string{4,3} // error
// - string{,} // means the same as no {}
// - string{...,...}[] array of strings with said width constraints

// number

// - number, needs to be a float
// - integer, needs to be an integer
// - (integer|number){x,y} , needs to be an integer between x and y (inclusive)
// - integer{x,} // integer minimum x (can be negative)
// - integer{,y} // integer maximum y (can be negative)
// - integer|number{...,...}[] // array of number

// boolean

// boolean, false or true
// boolean[], array of booleans
// boolean[n,m] the usuual

// regexp

// any ()

// all ()

// xpath like (use-context-stuff)

// the rest should be plugins
// url
// date (ISO-8601)
// YYYY-MM-DDThh:mm:ssTZD
// TZD= +hh:mm or -hh:mm
// http://mathforum.org/library/drmath/view/51907.html

// https://www.w3.org/TR/NOTE-datetime
// toNumber

/*
XPath:

/A/B/C
A//B/*[1] index base 1 (not index base 0)

/   from root node
//  current node and all nested children 
.   current node
..  parent of current node
@   attributes

bookstore
/bookstore/*
bookstore/book
//book
bookstore//book
//@lang

*
@*
node()
/bookstore/*
//*          selects all nodes and subnodes in the document
//title[@*]  

/bookstore/book[price>35]/price


3.2.1.  Paragraph 1


Basic Auth RFC 7617
authentication scope:

2. 'Basic' Authentication Scheme

Authentication request
"Basic"  "realm" charset(optional)µ
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
The base64 is constructed this way base64("user:password").

Server will send a header like this

WWW-Authenticate: Basic realm="foo", charset="UTF-8"

// proxy authorization??

Proxy-Authorization: Basic dGVzdDoxMjPCow==

same realm "docs"

http://example.com/docs/
http://example.com/docs/test.doc
http://example.com/docs/?page=1
https://tools.ietf.org/html/rfc6750


Auth2 workflow:

+--------+                               +---------------+
|        |--(A)- Authorization Request ->|   Resource    | (sometimes this is merged with authorisation server)
|        |                               |     Owner     |
|        |<-(B)-- Authorization Grant ---|               |
|        |                               +---------------+
|        |
|        |                                       +---------------+
|        |--(C)-- Authorization Grant  --------->| Authorization |
| Client |                                       |     Server    | (token issuer, refresh token issuer)
|        |<-(D)----- Access/Refresh Token -------|               | (must implement tls)
|        |                                       +---------------+
|        |
|        |                               +---------------+ (401 Unauthorized, no error code, client didnt seem aware it was a protected resource).
|        |--(E)----- Access Token ------>|    Resource   | (403 forbidden, error code = "insufficient_scope").
|        |                               |     Server    | (401 Unautorized, error_code = "invalid_token").
|        |<-(F)--- Protected Resource ---|               | (400 bad request, error="invalid_request").
+--------+                               +---------------+ (405 method not allowed).



This is an authorisation request:

GET /resource HTTP/1.1
Host: server.example.com
Authorization: Bearer mF_9.B5f-4.1JqM


this is authorization grant

- access_token can be a form parameter the request (POST C) or response (B) body
- in case of using the body to post access_token , content-type must be "application/x-www-form-urlencoded"
- content body consist entirely of "usascii" characters

example:

POST /resource HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded
access_token=mF_9.B5f-4.1JqM

also can use query parameter
(this is a bad idea to send this in the browser url)
GET /resource?access_token=mF_9.B5f-4.1JqM HTTP/1.1
Host: server.example.com

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="example"

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="example", error="invalid_token", error_description="The access token expired"

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="example", error="invalid_token", error_description="The access token expired"

HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache
{
    "access_token":"mF_9.B5f-4.1JqM",
    "token_type":"Bearer",
    "expires_in":3600,
    "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA"
}

See "HTTP State Management Mechanism" [RFC6265] for security considerations about cookies.

Access Token Response

HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
    "access_token":"mF_9.B5f-4.1JqM",
    "token_type":"Bearer",
    "expires_in":3600,
    "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA"
}

Some recommandations (from https://tools.ietf.org/html/rfc6750):

Don't pass bearer tokens in page URLs:  Bearer tokens SHOULD NOT be passed in request urls because 
request urls are logged.

GET /resource?access_token=mF_9.B5f-4.1JqM HTTP/1.1
Host: server.example.com

POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA&client_id=s6BhdRkqt3&client_secret=7Fjfp0ZBr1KtDRbnfVdmIw


https://tools.ietf.org/html/rfc6749#page-23

OAuth defines four grant types: authorization code, implicit,
resource owner password credentials, and client credentials.  It also
provides an extension mechanism for defining additional grant types.

4.1


     +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- & Redirection URI ---->|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates --->|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---<|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+                                      |      |
     |         |>---(D)-- Authorization Code ---------'      |
     |  Client |          & Redirection URI                  |
     |         |                                             |
     |         |<---(E)----- Access Token -------------------'
     +---------+       (w/ Optional Refresh Token)

(A)  The client initiates the flow by directing the resource owner's
        user-agent to the authorization endpoint.  The client includes
        its client identifier, requested scope, local state, and a
        redirection URI to which the authorization server will send the
        user-agent back once access is granted (or denied).

(B)  The authorization server authenticates the resource owner (via
        the user-agent) and establishes whether the resource owner
        grants or denies the client's access request.

(C)  Assuming the resource owner grants access, the authorization
        server redirects the user-agent back to the client using the
        redirection URI provided earlier (in the request or during
        client registration).  The redirection URI includes an
        authorization code and any local state provided by the client
        earlier.

(D)  The client requests an access token from the authorization
        server's token endpoint by including the authorization code
        received in the previous step.  When making the request, the
        client authenticates with the authorization server.  The client
        includes the redirection URI used to obtain the authorization
        code for verification.

(E)  The authorization server authenticates the client, validates the
    authorization code, and ensures that the redirection URI
    received matches the URI used to redirect the client in
    step (C).  If valid, the authorization server responds back with
    an access token and, optionally, a refresh token.


Authorization request

add parameters to query component

+ response_type: (REQUIRED) must be "code"

+ client_id: (REQUIRED) must be unqiue to the authorisation server, issued by the authorisation server, exposed to resource owner.

+ redirect_uri: (OPTIONAL) 

+ scope: (OPTIONAL) scope of access

+ state: (RECOMMENDED) opaque value to maintain state between state and callback (use it to prevent cross site forgery attacks).

Example:
GET /authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz
        &redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1
    Host: server.example.com

redirects by "Authorisation Server".

HTTP/1.1 302 Found
     Location: https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA
               &state=xyz    



Error response
  -> Authorisation server should notify the Resource Owner
  -> Authorisation server should NOT redirect if redirect url is present
 
  Notify "Resource owner" via post HTTP request

  FORM encoded body
  
  - 'error': (manditory) should be one of the following 'invalid_request' | 'unauthorized_client' | 'access_denied' | 'unsupported_response_type' | 'invalid_scope' | 'server_error' | 'temporarily_unavailable'
  - 'error_description': (optional) ascii additional information only charecters x20-21 / %x23-5B / %x5D-7E. So not 0x00-0X1f, 0x22, 0x5c.
  - 'error_uri':  (optional). A URI identifying a human-readable web page with
         information about the error,
  
https://github.com/bshaffer/oauth2-demo-php

  'channel',         'deleted',
  'id',              'type',
  'content',         'author',
  'member',          'pinned',
  'tts',             'nonce',
  'system',          'embeds',
  'attachments',     'createdTimestamp',
  'editedTimestamp', 'reactions',
  'mentions',        'webhookID',
  'hit',             '_edits'
       
  message.channel [
    'type',
    'deleted',
    'id',
    'name',
    'position',
    'parentID',
    'permissionOverwrites',
    'topic',
    'nsfw',
    'lastMessageID',
    'lastPinTimestamp',
    'rateLimitPerUser',
    'guild',
    'messages',
    '_typing'
  ]
  member.guild.memberCount
  const { channel, content } = msg;
  const { type, name, id } = channel
  console({ type, name, id, content });

*/