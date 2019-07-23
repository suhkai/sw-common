
export { };
declare var self: ServiceWorkerGlobalScope;

interface InstallEvent extends ExtendableEvent {
    readonly activeWorker: ServiceWorker;
}

//self.importScripts('/script1.js');

self.addEventListener('activate', e => {
    console.log(`%c activate event received`, 'color:green');
    e.waitUntil(new Promise(resolve => {
        setTimeout(() => {
            console.log(`%c activate event finished`, 'color:green');
            resolve();
        }, 5000);
    }).then(
        () => self.clients.claim()
        ));
});

self.addEventListener('fetch', e => {
    console.log(`%c fetching url: ${e.request.url}`, 'color:green');
    e.respondWith(fetch(e.request));
});


self.addEventListener('install', e => {
    const { activeWorker } = <InstallEvent>e;
    console.log(`%c install event received`, 'color:green');
    self.skipWaiting();
    e.waitUntil(new Promise(resolve => {
        setTimeout(() => {
            console.log(`%c install event finished`, 'color:green');
            resolve();
        }, 5000);
    }));
});

self.addEventListener('message', (e: ExtendableMessageEvent) => {
    console.log(`%c message event received`, 'color:green', e);
    // we are a service worker so this is either a Channel or a WindowClient
    const src: WindowClient = e.source as WindowClient;
    self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
        // do something with your clients list
        console.log("CLIENTS>>>>", clients);
        for (const client of clients as WindowClient[]) {
            if (client.visibilityState === 'visible') {
                // only allowed after you click on "notification", no permission here
                // you will get
                // code: 15
                // message: "Not allowed to focus a window."
                // name: "InvalidAccessError"
                // "Not allowed to focus a window."
                /*client.focus()
                .then(wc => {
                    console.log(wc.id);
                })
                .catch(err => {
                    console.log('oops something went wrong', err);
                });*/
            }
        }
    });
    // showNotifcation do it here
    const body = 'this is the  body of the text';
    //const actions = [{ action:'confirm-1', title:'WHAT the fuck', icon: confirm}];
    //e.waitUntil(self.registration.showNotification("Shiny", { actions, tag, badge, body, icon, image, renotify: false, requireInteraction: true, timestamp: Date.now() + 24 * 3600 * 1000 }));
});


self.addEventListener('messageerror', e => {
    console.log(`%c messageerror event received`, 'color:red');
});


self.addEventListener('notificationclick', e => {
    const no = e.notification;
    no.onclick;
    no.onerror;
    no.onshow;
    // doesnt work here
    no.onclose = () => console.log('notification is closing??');
    no.close();
    const promise = self.clients.matchAll({ type: 'window' })
        .then( clients => {
            const cl = clients as WindowClient[];
            for (const client of cl){
                if (client.visibilityState === 'visible'){
                    return client.focus();
                    break;
                }
            }
            return cl[0].focus();
        });
    e.waitUntil(promise);    
    console.log(`%c notificationclick event received`, 'color:green', e);
});

self.addEventListener('notificationclose', e => {
    const no = e.notification;
    no.close();
    console.log(`%c notificationclose event received`, 'color:green');
});


self.addEventListener('push', e => {
    console.log(`%c push event received`, 'color:green');
});

self.addEventListener('pushsubscriptionchange', e => {
    console.log(`%c pushsubscriptionchange event received`, 'color:green');
});

self.addEventListener('sync', e => {
    console.log(`%c sync event received`, 'color:green');
});

self.addEventListener('error', e => {
    console.log(`%c error event received`, 'color:red');
});
