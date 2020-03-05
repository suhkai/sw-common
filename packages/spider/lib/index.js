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

# startup

- scan directory for all ongoing ${projectdir/**/*.request files
- this is your todo list (contains naked urls or urls)
- create a todocontext from the put entry url name name on top the the todo list


# processing:

- pop todocontext off the top of the list
- should we be processing this?
- if not 
  - delete from disk if there are filenames associated with this context (if any)
  - continue to next todo-context
- if yes 
  - hydrate request headers (or generate them in case of entry point)
  - infer storage name from url and request headers
  - if ${projectdir}/filename.request exist and has response headers and ${projectdir}/filename exist 
     - rename ${projectdir}/filename.request to ${projectdir}/filename.response
     - continue to next todo-context
  - if ${projectdir}/filename.request exist and has response headers and ${projectdir}/filename.fetching exist 
     - attempt http-range fetching
       - if http-range fetching not possible, truncate the ${projectdir}/filename.fetching 
  - if (neither ${projectdir}/filename.request and  ${projectdir}/filename.fetching exist) create them  
  - fetch response headers + data
  - add response haders to file ${projectdir}/filename.request (there could be multiple response headers based on previous retries)
    - before response headers are added the handler designated to handle the response of the request (designated by rules) will modify the raw
        response headers (can had something like "Accept-Ranges: none") for example, to hint that on restart the spider should not use "Content Range" request header
  - save data to ${projectdir}/filename.fetching 
    - remark: the "save data" is a general way where new urls can be created along the way so it passes through a handler-> prudces pruned data for the saver
    - handler receives a readable and returns another readable where that is blead and persisted to disk
    - because of this extra layer, 
  - when done 
    - rename ${projectdir}/filename.fetching to ${projectdir}/filename.fetching
    - rename  ${projectdir}/filename.request to ${projectdir}/filename.response
    - continue to next to-do item


 -- options for spider
  -- basedir
  -- number of concurrent request or none
  -- logging
    -- level: verbose, terse (default)
    -- showstats: true, false (default)

tools we need, 
 - mkdir -p
 - hydrate/unhydrate not a yaml
 

request file looks like so

[url] 
url components just like url.prase('..')

[request ts]
header1 = value1 (you can have '=' but needs to be escaped)
..etc
[response ts]
header1 = value1 (you can have '=' but needs to be escaped)
..etc

[response ts]
header1 = value1 (you can have '=' but needs to be escaped)
..etc

[response ts]
header1 = value1 (you can have '=' but needs to be escaped)
..etc


