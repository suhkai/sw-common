

## Headers

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
Accept-Encoding: compress ## lZW
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



