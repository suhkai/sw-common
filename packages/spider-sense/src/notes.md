### Content-Disposition

Reponse header for the mainbody
```bash
Content-Disposition: inline
Content-Disposition: attachment
Content-Disposition: attachment; filename="filename.jpg"
```

Post request in "multipart/form-data" as part of the body

```bash
----boundery-id
Content-Disposition: form-data; name="fieldName"
Content-Disposition: form-data; name="fieldName"; filename="filename.jpg"
```

-- **name**: is the name of the `<input name="..">` field member of the form
-- **filename**: orginal filename being stransmitted

### Content-Type in the context of multipart messaging

`Content-Type: multipart/<mediatype> ; bounder=something`

##### partial content response
https://tools.ietf.org/html/rfc7233#section-4.1


```bash
HTTP/1.1 206 Partial Content
Date: Wed, 15 Nov 1995 06:25:24 GMT
Last-Modified: Wed, 15 Nov 1995 04:58:08 GMT
Content-Range: bytes 21010-47021/47022           # in the message body when multipart
Content-Length: 26012
Content-Type: image/gif
<empty line>
<body>
```

#### partial content response with multipart

Request example: `Range: bytes 400-1000/2000`

Response (does not accept range request):
```bash
HTTP/1.1 206 Partial Content
Accept-Ranges: none
```
#### multipart media type
https://tools.ietf.org/html/rfc2046#section-5.1

##### mulitpart media types (IANA)
https://tools.ietf.org/html/rfc6838#section-4.2.6

subtypes:
- multipart/text            (used in emails)
- multipart/mixed           (used in emails)
- multipart/parallel        (same as mixed but hardware try to show media in parallel)
- multipart/form-data       (used in POST messages to upload (for example files)
- multipart/byteranges      (used with "206 Partial Content")


Example: Request with multipart

`<form action="<url>" method="post" enctype="multipart/form-data">`

```bash
POST / HTTP/1.1
Host: localhost:8000
User-Agent: Mozilla/5.0 ....
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
## it was orginal an http request, server can upgrade to http for this 
## request via redirect "Location: https://.." heaeder
Upgrade-Insecure-Requests: 1        
Content-Type: multipart/form-data; boundery=-----------------------------8721656041911415653955004498
Content-Length: 465

<preamble data before the first bounder>
-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myFile"; filename="readme.txt"
 ## absent Content-Type header so  text/plain is assumed

Hello world
-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myTextField"

Test
-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myCheckBox"

on
-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myFile"; filename="test.txt"
Content-Type: text/plain

Simple file.
## not the extta "--" after the bounder
-----------------------------8721656041911415653955004498--
```

Example: Multipart Partial content 206 response

```bash
HTTP/1.1 206 Partial Content
Accept-Ranges: bytes                                        #yes, server accepts byte range request
#Accept-Ranges: none                                        #incase the server does not honer range request
Content-Type: multipart/byteranges; boundary=3d6b6a416f9b5
Content-Length: 385

<preamble data>
--3d6b6a416f9b5
Content-Type: text/html
Content-Range: bytes 100-200/1270    #format  <unit> <start>-<end>/<size>, size=* (unknown size)
<data>
--3d6b6a416f9b5
Content-Type: video/mp4
Content-Range: bytes 400-500/3270    #format  <unit> <start>-<end>/<size>, size=* (unknown size)
<most probably octet data>
--3d6b6a416f9b5--
```

- body part preceded by a boundery delimiter
- if only single part is returned, `Content-Range` header must be in the 206 response
- the bounder (in the body) stats with "--<boundery-delimiter>"
- the multipart transfer ends with "--<boundery-delimiter>--"
- all data in the bode before the first "--<boundery-delimter> is a preamble and not part of the actual data

## Headers

### TE (transfer encoding request header)

Maybe should have been called _ACCEPT-TRANSFER-ENCODING_

```bash
# full list, weird, so client cannot preference "chuncked"
TE: compress
TE: deflate
TE: gzip
TE: trailers # client willing to accept trailer fields

TE: trailers, gzip;q=0.5  # add quality parameter specifying preference
```

### Transfer-encoding (response)

`Transfer-Encoding` values:
- `chunked`   
- `compress` LZW
- `deflate` zlib
- `gzip` Z77
- `identity`

#### Transfer Encoding Chunked

https://tools.ietf.org/html/rfc7230#section-4.1

```bash
.
Transfer-Encoding: gzip, chunked
Trailer: .. specify this if you are going to use trailer-part
.
.<last-header>
\r\n  # empty line
<chunk size in hex>\r\n     # repeat these 2 lines undlessly till ed
<chunk data> (octets)\r\n
0\r\n                       # end
<trailer-part>              # see https://tools.ietf.org/html/rfc7230#section-4.1.2
```

About trailer-header, if trailer headers are critical to the data send, the sender
should not generate trailer part unless `TE: trailer` was specified.

Clients can ignore trailer messages, if `TE: trailer` was not specified in request




### If-Range = entity-tag / HTTP-date


### Vary

https://tools.ietf.org/html/rfc7231#section-7.1.4

A comma-separated list of header names to take into account when deciding whether or not a cached response can be used.

f you are serving different content to mobile users, it can help you to avoid that a cache may mistakenly serve a desktop version of your site to your mobile users.

```bash
Vary: <header1>, <header2>, ...
Vary: *    # same as Cache-Control: no-store
```



### Connection

2 possibilities

```bash
Connection: keep-alive
Connection: close
```

### Keep-Alive

Needs `Connection: Keep-Alive` to be set

```bash
## MINIMIM amount of time an idle connection needs to be kept open
Keep-Alive: timeout=9
## Maximum number of request that can be setn on this connection before closing
Keep-Alive: max=1000

### combined
Keep-Alive: max=1000,timeout=9
```

### Etag

optional  `W/` shows its a weak tag

`Etag:W/"<etag value>"   

Weak tags prevent caching when byte range request are used

`<etag value>`


### If-Match

TO avoid mid-air collisions.
use If-Match header to update data (like a wiki post)

```bash
If-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

### If-None-Match

- makes GET, HEAD methods conditional
- if used with PUT and value "If-None-Match: *", it will guarantee only an PUT if no previous put was made before (with the same ETag)

```bash
If-None-Match: "<etag_value>", "<etag-value>"
If-None-Match: *
```


### Accept-Encoding (request)

```bash
Accept-Encoding: gzip ##Z77
Accept-Encoding: compress ## LZW
Accept-Encoding: deflate ## zlib
Accept-Encoding: br ##broti
Accept-Encoding: identity # content as-is, always implicitly specified
Accept-Encoding: * # default value if header is not present, means "no preference"
```
**Accept-Encoding with ;q=**

`gzip;q=1.0` and `*:q=0.5`
_space added for emphasis_
Example: `Accept-Encoding: deflate,    gzip;q=1.0,    *;q=0.5`


### Content-Encoding (response)

```bash
Content-Encoding: gzip    ## use format LZ77, 
Content-Encoding: compress ## use format LZW
Content-Encoding: deflate  ## uses zlib
Content-Encoding: br ## broti algorithm
```

Can be `Content-Encoding: gzip, deflate`

### Accept 

Accept: */*  (mime-type format)
Accept: text/html
Accept: text/csv

Accept: type/subtype

type:
    - [application][iana-application]
    - [audio][iana-audio]
    - example(reserved)
    - [font][iana-font], font/woff, font/ttf
    - [image][iana-image]
    - model (model for 3d object) model/3mf
    - [text][iana-text]
    - [video][iana-video] (video/mp4)
  

### Expires

If there is _Cache-Control_ with _max-age_ or _s-max-age_ in the response the Expires header is ignored

`Expires: An HTTP-date timestamp`

Example:
`Expires: Wed, 21 Oct 2015 07:28:00 GMT`

### Cache-Control

Uses directives:

- Case-insensitive, but lowercase is recommended.
- Multiple directives are comma-separated.
- Some directives have an optional argument, which can be either a token or a quoted-string. (See spec for definitions)

#### Request

```bash
# the maximum amount of time a cache is considered fresh,
#   time specified is relative
Cache-Control: max-age=<seconds>
# the client will accept a stale response. up to max-stale seconds
Cache-Control: max-stale[=<seconds>]
# The client wants a response that will still be fresh for at least the specified n seconds
Cache-Control: min-fresh=<seconds>
## is the same as combination "max-age=0, must-revalidate"
# (response may be stored by any cache (no-cache is not the same as no-store)
# stored response must always go through validation with origin server
Cache-Control: no-cache
## prevents NEW resource of being cached
## Cache-Control: no-store, max-age=0 # also clears cache immediatly
Cache-Control: no-store
# do not transform assets, proxy should not re-encode images
Cache-Control: no-transform
# Set by the client to indicate "do not use the network" for the response.
# dont use together with If-None-Match
Cache-Control: only-if-cached
```


#### Response

```bash
## when a resource becomes stale, caches must not use their stale copy 
Cache-Control: must-revalidate

## Prevent caching, but can still serve non-stale earliet cached resource
## is the same as combination "max-age=0, must-revalidate"
Cache-Control: no-cache

## prevents NEW resource of being cached
## Cache-Control: no-store, max-age=0 # also clears cache immediatly
Cache-Control: no-store

# do not transform assets, proxy should not re-encode images
Cache-Control: no-transform

# may be stored by any cache, even if the response is normally non-cacheable.
Cache-Control: public 
# response may be stored only by a browser's cache,
Cache-Control: private
# Like must-revalidate, but only for shared caches (e.g., proxies).
Cache-Control: proxy-revalidate

Cache-Control: max-age=<seconds>
# Overrides max-age or the Expires header, but only for shared caches (e.g., proxies). Ignored by private caches
Cache-Control: s-maxage=<seconds>
```


#### NON STANDARD
## Extension Cache-Control directives
```bash
# Indicates that the response body will not change over time. 
Cache-Control: immutable
Cache-Control: stale-while-revalidate=<seconds>
Cache-Control: stale-if-error=<seconds>
```

[iana-mime ]:https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
[iana-application]: https://www.iana.org/assignments/media-types/media-types.xhtml#application
[iana-audio]: https://www.iana.org/assignments/media-types/media-types.xhtml#audio
[iana-font]: https://www.iana.org/assignments/media-types/media-types.xhtml#font
[iana-image]: https://www.iana.org/assignments/media-types/media-types.xhtml#image
[iana-text]: https://www.iana.org/assignments/media-types/media-types.xhtml#text
[iana-video]: https://www.iana.org/assignments/media-types/media-types.xhtml#video



