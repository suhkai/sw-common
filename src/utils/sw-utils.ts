import { EventEmitter } from "events";

const errors = [
    { id: 100, text: 'No ServiceWorkerContainer Object' }
];

export function hasSW() {
    return !!navigator.serviceWorker;
}

export async function isRegistered(...scopes: string[]) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (!registrations) {
        return [false, scopes];
    }
    const unhandledScopes = scopes.filter(scope => !registrations.find(r => r.scope === scope));
    return unhandledScopes.length ? [false, unhandledScopes] : [true, null];
}

export function decorateServerceWorkerContainer() {
    const serviceWorkerCont = navigator.serviceWorker;
    /*
       The oncontrollerchange property of the ServiceWorkerContainer interface is an event handler fired whenever a controllerchange event occurs 
       — when the document's associated ServiceWorkerRegistration acquires a new "ServiceWorkerRegistration.active worker."
       question does the servicechnage event has the service worker as a target?
       the serviceWorkerContainer.controller immediatly reflects the active service worker being used
    */
    serviceWorkerCont.addEventListener('controllerchange', function (e) {
        console.log('ControllerChange Event received=>', e);
    });
    /*
        when the service worker sends a message
    */
    serviceWorkerCont.addEventListener('message', function (e) {
        console.log('MessageEvent received=>', e);
    });
    /*
        no clue when this happens, from the docs =>
        The messageerror event is fired on a Window object when it receives a message that can't be deserialized.
    */
    serviceWorkerCont.addEventListener('messageerror', function (e) {
        console.log('MessageEvent (messageerror) received =>', e);
    });
}

// if sw is being installed dont try and install gain just wait for it to finnish
// returns a service worker whos state is activated, or null if it is a forced refresh
export async function getSWState() {
    const serviceWorkerCont = navigator.serviceWorker;
    let sw = await Promise.resolve().then(() => serviceWorkerCont.controller); // wait an extra "tick"
    if (sw) {
        return sw.state; // "installing", "installed", "activating", "activated", or "redundant". 
    }
    else {
        return 'uninstalled'; // nothing installed
    }
}

//type ListenerRegistration = (this: ServiceWorkerRegistration, ev: Event) => any

export async function registerSW(url: string, scope: string, evtTarget: EventTarget) {
    const serviceWorkerCont = navigator.serviceWorker;
    const registration = await serviceWorkerCont.register(url, { scope });
    // 
    /* 
      The onupdatefound property of the ServiceWorkerRegistration interface is an EventListener property called 
      whenever an event of type statechange (on the ServiceWorker) is fired; 
      it is fired any time the "ServiceWorkerRegistration.installing" property acquires a new service worker.
    */
    registration.addEventListener('updatefound', () => {
        // registration.waiting -> serviceworker "state" is "installed"
        // registration.installing -> serviceworker "state" is "installing"
        // registration.active -> service worker "state" is "activating" or "activated"

        const serviceWorker = registration.installing;
        if (serviceWorker) {
            serviceWorker.onstatechange = serviceWorker.onstatechange || function (e: Event) {
                evtTarget && evtTarget.dispatchEvent(new CustomEvent('statechange', { detail: { serviceWorker } }));
            };
        }
    });
}

    // 1. is has serviceworkercontroller?
        
    // 1.1 decorate service worker
    // 2. is there a serviceworker registered with the scopy?
        // -> is there a controlling service worker? 
            // -> deregister
            // wait for de-registration to complete 
    // 2.2 create service worker registration
    // service worker active 

    // phase 1 done (service worker active)

    // 3. find web assets.json with assets etc (dont call it manifest.json)
    // 4. send asset list to SW (if it was registerd in previous step) and wait for it to cache "done"
    // 5. when it is done, inject the JSONP into the HTML and rotate the webapp into view
    // 
    
// lets  have a list of stock tracking et
// set simple barriers at first
// if one of the barriers breaks then signal

// were to get free stock tickers