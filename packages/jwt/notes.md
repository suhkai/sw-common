# JWT

Some docs

## [JSON Web Token Best Current Practices][rfc8725]

## [The OAuth 2.0 Authorization Framework: Bearer Token Usage][rfc6750]


- Bearer Token:
    - A security token with the property that any party in possession of
      the token (a "bearer") can use the token in any way that any other
      party in possession of it can.  Using a bearer token does not
      require a bearer to prove possession of cryptographic key material
      (proof-of-possession).

```bash
     +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     |        |<-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+

                     Figure 1: Abstract Protocol Flow
```

The abstract OAuth 2.0 flow illustrated in Figure 1 describes the
interaction between the client, resource owner, authorization server,
and resource server (described in [RFC6749]).

### Authoriazion request

Example request headers:
```http
GET /resource HTTP/1.1
Host: server.example.com
Authorization: Bearer mF_9.B5f-4.1JqM
```

Using From request fields:
```http
POST /resource HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded
<empty line>
access_token=mF_9.B5f-4.1JqM
```

Using Query request parameter:
```http
GET /resource?access_token=mF_9.B5f-4.1JqM HTTP/1.1
Host: server.example.com
```

Using URI Query parameter:
```http
GET /resource?access_token=mF_9.B5f-4.1JqM HTTP/1.1
Host: server.example.com
```

### Authorization Response

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="example", error="invalid_token",error_description="The access token expired"
```

#### [Error response codes][rfc6750#section-3.1]

- invalid_request
- invalid_token
- insufficient_scope

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="example"
```

#### [4. Example Access Token Response][https://datatracker.ietf.org/doc/html/rfc6750-4]

```http
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
```

## [JSON Web Signature (JWS)][rfc7515]

This document defines two serializations for JWS's:
- A compact, URL-safe serialization called the `JWS Compact Serialization`.
- A JSON serialization called the `JWS JSON Serialization`.

In both serializations, the JWS Protected Header, JWS Payload, and JWS
Signature are base64url encoded, since JSON lacks a way to directly
represent arbitrary octet sequences.

**In the JWS Compact Serialization, no JWS Unprotected Header is used.**

In this case, the JOSE Header and the JWS Protected Header are the
same.

In the JWS Compact Serialization, a JWS is represented as the
concatenation:
```code   
BASE64URL(UTF8(JWS Protected Header)) || '.' ||
BASE64URL(JWS Payload) || '.' ||
BASE64URL(JWS Signature)
```

### Header Parameter Names

- alg: (algorithm)
- jku: [j]w[k] [u]rl  (JWK set URL)
    - refers to a set of jspn encoded public keys
    - one of these public keys was used to sign
    - HTTP GET request to get the key must use https
- jwk: Json web key. Public key to create the signature
- kid: Key ID. Hint indicating which key was used to sign. Structure is unspecified
- x5u: (X.509 Certificate Chain) Header Parameter.
- x5t: (X.509 Certificate SHA-1 Thumbprint)
- x5t#S256: (X.509 Certificate SHA-256 Thumbprint)
- typ: (Type)  The media type of this **complete JWS**. ??? https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.9
- cty: (content type) Header Parameter is used by JWS applications
   to declare the media type **of the secured content**
   (the payload).
- crit: (Critical) Header Parameter

Example:

```json
{
    "alg":"ES256",
    "crit":["exp"], // exp must be understood by program receiving jwt
    "exp":1363284000
}
```     


example jku:
```json
 {
    "kty":"EC",
    "crv":"P-256",
    "x":"f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
    "y":"x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
    "kid":"Public key used in JWS spec Appendix A.3 example"
}
```

In the JWS JSON Serialization, a JWS is represented as a JSON object
containing some or all of these four members:

-  "protected", with the value BASE64URL(UTF8(JWS Protected Header))
-  "header", with the value JWS Unprotected Header
-  "payload", with the value BASE64URL(JWS Payload)
-  "signature", with the value BASE64URL(JWS Signature)


### [Chapter 5: Producing and Consuming JWSs][rfc7515-chap-5]

Unsecured JWT has "alg": "none" 

### [Chapter 7.2.1: General JWS JSON Serialization Syntax][rfc7515-chap-7.2]

```json
{
    "payload":"<payload contents>",
    "signatures":[
        {"protected":"<integrity-protected header 1 contents>",
        "header":<non-integrity-protected header 1 contents>,
        "signature":"<signature 1 contents>"},
        ...
        {"protected":"<integrity-protected header N contents>",
        "header":<non-integrity-protected header N contents>,
        "signature":"<signature N contents>"}
    ]
}
```

[rfc8725]: https://datatracker.ietf.org/doc/html/rfc8725
[rfc7515]: https://datatracker.ietf.org/doc/html/rfc7515
[rfc7515-chap-5]:  https://datatracker.ietf.org/doc/html/rfc7515#section-5
[rfc7515-chap-7.2]: https://datatracker.ietf.org/doc/html/rfc7515#section-7.2.1
[rfc6750]: https://datatracker.ietf.org/doc/html/rfc6750
[rfc6750-3.1]: https://datatracker.ietf.org/doc/html/rfc6750#section-3.1
[rfc6750-4]: https://datatracker.ietf.org/doc/html/rfc6750#section-4
