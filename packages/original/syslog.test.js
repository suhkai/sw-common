// use nodev10
const { RFC3164 } = require('syslog-pro');

let syslog = new RFC3164({
    applacationName: 'error_lubet_jaws_jaws_jaws',
    facility: 'local7',
    server: {
        target: '10.128.130.18',
        protocol: 'udp',
        port: 514
    }
});
// send something every 1500 seconds
syslog.warn('[19251]: [Debug] (NGTQCPHP:GARBAGECOLLECTORSERVICE) addToCallsRecord: {"callId":"ngtqcphpcmybhidivu1bpoytzyabvw7f"} [/opt/videocall-garbage-collector-prod/58200/videocall-garbage-collector/lib/service/garbagecollector/GarbageCollectorService.js, 37. sor][errorId:empty.log]');
