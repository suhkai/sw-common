import fs from 'fs';

console.log('hello world');

//service worker supported by your browser?
//service worker installed?
    //-> register, service worker
    //-> get manifest.json
    //-> "infer" from manifest, what files to load and in what order to inject into the html
    //-> script loading, (use XMLHTTPrequest, IE doesnt fire "onload" handler of "script" tag)
    //-> create dynmic script loader to load scripts

//detect if there is a manifest.json
// -> error page, there is no manifest file found (or you are offline)
// -> processManiferst

//Critical failures
// if there is no manifest.json, -> 404 then basicly nothing we can do (just say manifest file could not be found)
// if just the netowrk is offline, (tested on chrome) -> loading scripts via script tag is duable, watch out for errors

// If there is no serviceworker and the  manifest cannot be loaded -> fatal error (network issue, try again if yu are online)
// if there is a serviceworker and manifest cannot be loaded from net, -> go to init application (attached script tags and what not)
// if there is a serviceworker and manifest can be loaded from the net -> attempt update of resources (or continue with it) and go to init app

//  --init application.
//  --load resources previously fetched by manifest (cached or not cached by service worker).
// if everything completes - start application.
// any error during initialisation, means either cache is purged by browser or wifi connection stoped).
// service can find itself with an empty db, in that case everything needs to be cached again ASAP
// so the bootstrap remains "active" and can install in the background, we call it an installer
//      especially after a purge of the cache by the browser

// Any more edge cases?

