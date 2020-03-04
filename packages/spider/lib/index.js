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
}
*/

function createSpider instance

function addEntry

function concurrent fetches (handle with agent)

function define rules

function createStorageName

function validateStorage metadata (time, etag, etc)

function create logger, use the stacktrace to define linenumber etc ( option configurable  )

function log statistics

function restartable (make work queue persistent) (nlv)

since urls map to a storage location, its possible to work with file extentions to see if a resource fetch was properly received
storage locations map to urls? , yes a url.request file is saved, this means it needs to be fetched if the url.response file exist and uri resource has been downloaded

Example: download /favicon.png

1. request headers are saved to ${projectdir}/favicon.png.request (yaml format)

2. request headers are used to fetch uri

3. server response is APPENDED (after resolving redirects)! to ${projectdir/favicon.png.request and the file name is changed to ${projectdir/favicon.png.fetching

5a. if 4xx or 5xxx happens then ${projectdir/favicon.png.fetching is renamed to ${projectdir/favicon.png.error.<http-error-code>

4. the (empty) file "favicon.png" is created

5. data is being saved to favicon.png

6. favicon.png file is closed after downloaded successfully

7. if data was fetched successfully then then rename ${projectdir}/favicon.png.fetching to ${projectdir}/favicon.png.response















