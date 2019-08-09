'use strict'

import createErrors, { ColorCodes, LOGFunction } from './error';

// store these errors in the indexDB database, but console will do for now
const log = createErrors('media-features');

type MQEventMapper = (this: MediaQueryList, ev: MediaQueryListEvent) => CustomEvent | false;

const createMQLEventDispatcher = (trg: EventTarget) => (listener: MQEventMapper) => {
  return function (this: MediaQueryList, ev: MediaQueryListEvent) {
    const evt = listener.call(this, ev);
    if (evt) {
      trg.dispatchEvent(evt);
    }
  }
}

window.addEventListener('load', function (this: EventTarget, e) {

  const body = document.querySelector('body');
  if (!body) {
    log.error('mf01', 'body doest exist');
    return;
  }

  const mqFeaturSet = (<any>self)['mediaQL'] = new Map();

  const bodyDispatch = createMQLEventDispatcher(body);

  function createInterest(requestMQ: string, fn: MQEventMapper): () => ([{ responseMQ: string, matches: boolean }?, Error?]) {
    const mql = window.matchMedia(requestMQ);
    if (mql.media === 'not all') {
      const msg = `invalid mediaQ "${requestMQ}" -> "not all"`;
      log.error('cri01', msg);
      return () => [undefined, new TypeError(msg)];
    }
    const dispatch = bodyDispatch(fn);
    mql.addListener(dispatch);
    return () => [{ responseMQ: mql.media, matches: mql.matches, fn }, undefined];
  }

  function registerMQ(query: string, evtCreator: MQEventMapper) {
    const fn = createInterest(query, evtCreator);
    mqFeaturSet.set(query, fn);
  }
  registerMQ('(orientation: landscape)', ev => new CustomEvent(ev.matches ? 'landscape' : 'portrait'));
  registerMQ('(max-color: 2)', ev => new CustomEvent(ev.matches ? 'monogrome' : 'color'));
  registerMQ('(pointer: none)', ev => ev.matches && new CustomEvent('hid-keyboard'));
  registerMQ('(pointer: coarse) and (hover: none)', ev => ev.matches && new CustomEvent('hid-touch'));
  registerMQ('(pointer: fine) and (hover: none)', ev => ev.matches && new CustomEvent('hid-stylus'));
  registerMQ('(pointer: fine) and (hover: hover)', ev => ev.matches && new CustomEvent('hid-terminal'));
  registerMQ('(pointer: coarse) and (hover: hover)', ev => ev.matches && new CustomEvent('hid-terminal-touch'));
  // do with accourding to xs, sl etc
  registerMQ('(max-width: 399.9999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[0:360)' } }));
  registerMQ('(min-width: 360px) and (max-width: 399.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[360:400)' } }));
  registerMQ('(min-width: 400px) and (max-width: 479.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[360:480)' } }));
  registerMQ('(min-width: 480px) and (max-width: 599.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[480:600)' } }));
  registerMQ('(min-width: 600px) and (max-width: 719.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[600:720)' } }));
  registerMQ('(min-width: 720px) and (max-width: 839.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[720:840)' } }));
  registerMQ('(min-width: 840px) and (max-width: 959.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[840:960)' } }));
  registerMQ('(min-width: 960px) and (max-width: 1023.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[960:1024)' } }));
  registerMQ('(min-width: 1024px) and (max-width: 1279.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[1024:1280)' } }));
  registerMQ('(min-width: 1280px) and (max-width: 1439.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[1280:1440)' } }));
  registerMQ('(min-width: 1440px) and (max-width: 1599.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[1440:1600)' } }));
  registerMQ('(min-width: 1600px) and (max-width: 1919.99999px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[1600:1920)' } }));
  registerMQ('(min-width: 1920px)', ev => ev.matches && new CustomEvent('screen-width', { detail: { w: '[1920: infinity)' } }));
});

// referenced: https://www.w3.org/TR/mediaqueries-4/#aspect-ratio

/* interactive testing
const mqList = window.matchMedia('(any-pointer: fine)');
console.log(`matches now?: ${mqList.matches}`);
console.log(`media key: ${mqList.media}`); // if this is "not all" then the query is invalid
mqList.addListener(e => {
  console.log(e);
});
| Breakpoint Range (dp) | Portrait       | Landscape      | Window | Columns | Margins / Gutters* | css media query for matching                 |
|-----------------------|----------------|----------------|--------|---------|--------------------|----------------------------------------------|
| 0-359                 | small handset  |                | xsmall | 4       | 16                 | (min-width:0px) and (max-width:599.95px)     |
| 360-399               | medium handset |                | xsmall | 4       | 16                 |                                              |
| 400-479               | large  handset |                | xsmall | 4       | 16                 |                                              |
| 480-599               | large handset  | small handset  | xsmall | 4       | 16                 |                                              |
| 600-719               | small tablet   | medium handset | small  | 8       | 16                 | (min-width:600px) and (max-width:959.95px)   |
| 720-839               | large tablet   | large handset  | small  | 8       | 24                 |                                              |
| 840-959               | large tablet   | large handset  | small  | 12      | 24                 |                                              |
| 960-1023              |                | small tablet   | small  | 12      | 24                 | (min-width:960px) and (max-width:1279.95px)  |
| 1024-1279             |                | large tablet   | medium | 12      | 24                 |                                              |
| 1280-1439             |                | large tablet   | medium | 12      | 24                 | (min-width:1280px) and (max-width:1919.95px) |
| 1600-1919             |                |                | large  | 12      | 24                 |                                              |
| 1920 >                |                |                | xlarge | 12      | 24                 | (min-width:1920px)                           |

| width | min  | max     |
|-------|------|---------|
| xs    | 0    | 599.95  |
| sm    | 600  | 959.95  |
| md    | 960  | 1279.95 |
| lg    | 1280 | 1919.95 |
| xl    | 1920 | --      |

*/
