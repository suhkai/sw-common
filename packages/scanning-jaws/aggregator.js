"use strict";
const WebSocket = require("ws");
const fs = require('fs');

let s;
const dev = 'ws://10.128.130.18:10105';
const prod = 'ws://10.135.130.42:10105';

const un = new Map();
setInterval(() => {
    const data = Array.from(un.values());
    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
    }
}, 1E3);

async function init() {
    s = new WebSocket(prod);
    s.on('open', () => {
        console.log('connected');
    });
    s.on('close', () => {
        setTimeout(() => init(), 5000);
    });
    s.on('message', (raw) => {
        const { headers, payload } = JSON.parse(raw);
        const { name, kind } = headers;

        if (name === 'performerStatus' || name === 'performerNotifications' || name === 'edsNotification') {
            const { fromHost: host, pid } = headers._m;
            if (host !== 'jsm-fe-backconn-sgsin-0'){
                return
            }
            const body = JSON.parse(payload);

            if (name === 'performerNotifications') {
                const { nrClients } = body;
                const { getConnectionCount, join } = body.callbacks;
                const { subscribers: { subUpdates: { emptyFetch, nonEmptyFetch } } } = body.subs;
                const key = `${name}-${host}-${pid}-${name}`;
                const pl = `${name},${host},${pid},${nrClients},${getConnectionCount},${join},${emptyFetch},${nonEmptyFetch}`;
                un.set(key, pl);
                return;
            }

            if (name === 'performerStatus') {
                const { nrClients } = body;
                const { callbacks: { getConnectionCount, getOnlinePerformersCnt } } = body;
                const pl = `${name},${host},${pid},${nrClients},${getConnectionCount},${getOnlinePerformersCnt}`;
                const key = `${name}-${host}-${pid}-${name}`;
                un.set(key, pl);
                return;
            }

            if (name === 'edsNotification') {
                const { nrClients } = body;
                const {
                    onMsgEventMiss,
                    onMsgEventHit,
                    onMsgTargetMiss,
                    onMsgTargetHit,
                    callbacks: {
                        getConnectionCount,
                        authFail,
                        authSuccess,
                        subscribeFail,
                        subSuccess,
                        activityFail,
                        actSuccess,
                        onStatFail,
                        onStatSuccess,
                    },
                } = body;
                const pl = `${name},${host},${pid},${nrClients},${getConnectionCount},${authFail},${authSuccess},${subscribeFail},${subSuccess},${activityFail},${actSuccess},${onStatFail}
                ,${onStatSuccess},${onMsgEventMiss},${onMsgEventHit},${onMsgTargetMiss},${onMsgTargetHit}`;
                const key = `${name}-${host}-${pid}-${name}`;
                un.set(key, pl);
                return;
            }
        }
    });
}

init().catch(err => {
    console.log(`There was an error ${String(err)}`);
});
