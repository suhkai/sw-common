const parse5 = require('parse5');
const ta = require('parse5/lib/tree-adapters/default');
const html = require('parse5/lib/common/html');
const clone = require('clone');

const {
  NAMESPACES: {
    HTML
  }
} = html;

const isUndef = o => o === undefined;
const atrcnt = a => a.attrs.length
const createElement = (tag, attrs = []) => ta.createElement(tag, HTML, attrs);

function convertOptionTagsToP5(tagName, tags) {
  const elts = [];
  for (const tag of tags) {
    const attrs = Object.entries(tag).map(([p, v]) => {
      const rc = {
        name: p,
        value: v
      };
      return rc;
    });
    attrs.sort(sortAttributes);
    elts.push(createElement(tagName, attrs));
  }
  return elts;
}

function sortAttributes(a1, a2) {
  if ((isUndef(a1) || isUndef(a1.name)) && ((isUndef(a2) || isUndef(a2.name)))) {
    return 0;
  }
  if (isUndef(a1) || isUndef(a1.name)) return -1;
  if (isUndef(a2) || isUndef(a2.name)) return 1;
  if (a1.name > a2.name) return 1;
  if (a1.name < a2.name) return -1;
  return 0;
}

function sortTags(t1, t2) {
  // if both t1 and t2 dont have attributes, they are equal
  // should never happen, but devs can make mistakes, so move this to the top
  //
  if (t1.attrs.length === 0 && t2.attrs.length === 0) return 0;
  if (t1.attrs.length === 0) return -1;
  if (t2.attrs.length === 0) return 1;
  //
  const max = Math.min(t1.attrs.length, t2.attrs.length);
  let i = 0;
  let r = 0;
  while (i < max) {
    r = sortAttributes(t1.attrs[i], t2.attrs[i]);
    if (r !== 0) break;
    i++;
  }
  if (i === max) {
    return t1.attrs.length - t1.attrs.length;
  }
  return r; // return last result of inequality
}

/**
 * meta: [{
 *    attr1: value
 *    attr2: value , etc
 * }]
 */

function tagProcessing(tagName, tags) {

  // sort tags amongst themselves
  tags.sort(sortTags);
  // deduplication
  const rc = tags.filter((t1, idx, arr) => {
    const found = arr.slice(idx + 1).find(a => {
      const found2 = sortTags(a, t1) === 0;
      return found2;
    });
    // FIXME:  compare also values of the attributes
    found && found.value)
    return !found;
  });
  //
  return rc;
}

// 
// create <!DOCTYPE html><htm><head></head><body></body></html>
//

function createSkeleton(lang) {
  const doc = ta.createDocument();
  const html = createElement('html');
  if (lang) {
    html.attrs.push({
      name: 'lang',
      value: lang
    });
  }
  const head = createElement('head');
  const body = createElement('body');
  ta.appendChild(doc, html);
  ta.appendChild(html, head);
  ta.appendChild(html, body);
  return [doc, html, head, body];
}

function appendTo(parent, children) {
  // meta, link, script, title, base, etc
  for (const child of children) {
    for (const attribute of child.attrs) {
      const elt = createElement(child.tag, HTML, child.attrs);
      ta.appendChild(parent, elt);
      if (child instanceof Array) {
        appendToHead(elt, child);
      }
    }
  }
}

function htmlProcessing(logger, title, base, meta, link, scripts, appId, lang) {
  const metaCleaned = tagProcessing('meta', clone(meta));
  const linkCleaned = tagProcessing('link', clone(link));
  // generate html skeleton
  const [doc, html, head, body] = createSkeleton(lang);
  appendTo(head, metaCleaned);
  appendTo(head, linkCleaned);
  if (title) {
    const titleElt = createElement('title');
    ta.insertText(titleElt, title);
    ta.appendChild(head, titleElt);
  }
  if (base) {
    const baseElt = createElement('base');
    const {
      target = '_blank', href
    } = base;
    baseElt.attrs.push({
      name: 'href',
      value: href
    });
    baseElt.attrs.push({
      name: 'target',
      value: target
    });
    ta.appendChild(head, baseElt);
  }
  for (const script of scripts) {
    const scriptElt = createElement('script');
    // attributes on scrip tag
    const {
      async: _async,
      charset,
      defer,
      src,
      attach
    } = script;
    if (charset) {
      scriptElt.attrs.push({
        name: 'charset',
        value: charset,
      });
    }
    if (_async) {
      scriptElt.attrs.push({
        name: 'async',
        value: _async,
      });
    }
    //src must be there
    if (!src) {
      logger.error('configuration error: script must have a "src" attribute');
      // never reached, will throw an error
    }
    scriptElt.attrs.push({
      name: 'src',
      value: src
    });
    if (attach === 'body') {
      appendTo(body, script);
    } else {
      appendTo(head, script);
    }
  } // for all scripts
  // appid
  if (appId) {
    const appIdElt = createElement('div');
    appIdElt.attrs.push({
      name: 'id',
      value: appId
    });
    // insert it at the start of the body
    body.childNodes.unshift(appIdElt);
  }
  return [html, head, body, doc];
}

module.exports = {
  htmlProcessing,
  convertOptionTagsToP5,
  createElement,
  serialize: parse5.serialize
};