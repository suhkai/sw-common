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

