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
    return () => [{ responseMQ: mql.media, matches: mql.matches }, undefined];
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
});

// referenced: https://www.w3.org/TR/mediaqueries-4/#aspect-ratio

/* interactive testing
const mqList = window.matchMedia('(any-pointer: fine)');
console.log(`matches now?: ${mqList.matches}`);
console.log(`media key: ${mqList.media}`); // if this is "not all" then the query is invalid
mqList.addListener(e => {
  console.log(e);
});
*/
