
/*
function spider() {
    url to resource storagelocation mapping ".cache/"
    select parser based on url
    "url meta info like headers plv (more for reference later)"
    "filename.jpg.headers"
    url 
      - deny
      - allow 
        - map to local name in cache
    head (always do this)  prefetch headers
    fetch
    processing -> generate new urls and request headers to parse
    save

    requirements (all goals):
        (optional) have the download be interruptable so it can continue at another time
        persist the workqueue
        range request possible (partial download) https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
        Etags and timeout
}*/

