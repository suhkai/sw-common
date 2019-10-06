const {
  relative,
  resolve
} = require('path');
const parse5 = require('parse5');
const ta = require('parse5/lib/tree-adapters/default');
const hmtl = require('parse5/lib/common/html');
const {
  NAMESPACES: {
    HTML
  }
} = require('parse5/lib/common/html');

// remove now the colors
require('colors');

function normalizeAttrProps(attr) {
  return Object.entries(attr || {}).map(([p, v]) => [p && p.toLowerCase(),
    v && typeof v === 'string' && v.toLowerCase() || v
  ]).sort((a, b) => {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });
}

function metaIsEaual(m1, m2) {
  //
  // normalize
  //
  const n1 = normalizeAttrProps(m1);
  const n2 = normalizeAttrProps(m2);
  if (n1.length !== n2.length) return false;
  let i = 0;
  while (n1[i][0] === n2[i][0] && n1[i][1] === n2[i][1] && i < n1.length) {
    i++
  }
  if (i === n1.length) return true;
  return false;
}

function isObject(o) {
  return (a !== null && typeof o === 'object' && !Array.isArray(o));
}


function skeleton(lang) {
  const doc = ta.createDocument();
  const html = ta.createElement('html', HTML, [{
    name: 'lang',
    value: lang
  }])
  ta.appendChild(doc, html);
  const head = ta.createElement('head', HTML, []);
  ta.appendChild(html, head);
  const body = ta.createElement('body', HTML, []);
  ta.appendChild(html, body);
  return [doc, html, head, body];
}

function buildMetasOrLinks(tag, head, metas = [{}], cb) {
  const uniqueMeta = [];
  if (cb) {
    cb(uniqueMeta);
  }
  for (const meta of metas) {
    const found = uniqueMeta.find(m => {
      return metaIsEaual(m, meta);
    });
    if (found) continue;
    Object.keys(meta).length && uniqueMeta.push(meta);
  }
  for (const meta of uniqueMeta) {
    const metaElt = ta.createElement(tag, HTML, normalizeAttrProps(meta).map(e => ({
      name: e[0],
      value: e[1] === undefined ? '' : String(e[1])
    })));
    ta.appendChild(head, metaElt);
  }
}

function addTitle(head, title) {
  const tag = ta.createElement('title', HTML, []);
  ta.appendChild(head, tag);
  ta.insertText(tag, title);
  return tag;
}

function addBase(head, href, target) {
  const attrs = [];
  if (target) {
    attrs.push({
      name: 'target',
      value: target
    });
  }
  if (href) {
    attrs.push({
      name: 'href',
      value: href
    });
  }
  const tag = ta.createElement('base', HTML, attrs);
  ta.appendChild(head, tag);
  return tag;
}

const addSuffix = (path, suffix) => {
  if (!suffix) return path;

  const param = suffix === true ? `s=${Date.now()}` : suffix;
  return `${path}?${param}`;
};


module.exports = function htmlGenerator(po) {

  const {
    lang = 'en',
      base,
      title = 'rollup.js app',
      metas,
      mobile = true,
      links,
      favicon,
      fileName = 'index.html',
      inject = true,
      showErrors,
      appMountId,
      baseHref,
      // planned
      // excludeChunks,
      // chunksSortMode
      // chunks
      // excludeChunks , will inject scripts and styles 
      // template
      // hash (querystring hash?)
      suffix = false,
  } = po;

  const [doc, html, head, body] = skeleton(lang);
  buildMetasOrLinks('meta', head, metas, unique => {
    if (mobile) {
      unique.push({
        content: 'width=device-width,initial-scale=1',
        name: 'viewport'
      })
    }
  });

  buildMetasOrLinks('link', head, links, unique => {
    if (favicon !== undefined) {
      unique.push({
        rel: 'shortcut icon',
        href: favicon
      });
    }
  });

  title && addTitle(head, title);
  base && addBase(head, base);
  console.log(parse5.serialize(doc).blue);



  let cnt = 1;
  return {
    name: 'htmlGenerator',
    /*async load(id) {
      console.log('load'.red);
      console.log(`  ->[id]:${id}`.yellow);
      return 'console.log("hello world");';
    },*/
    async buildStart(io) {
      console.log('buildStart'.red);

    },
    async banner(a, b) {
      console.log('banner'.red);
      return '/* HELLO WOOOOOOOOORLD */'; // will be added to the text
    },
    buildEnd(error) {
      console.log('buildEnd'.red);
      error && console.log(`error is: ${String(error).green}`);
    },
    /*resolveId(source, importer) {
      console.log('resolveId'.red);
      console.log(`  ->[source][${source}]`.yellow);
      console.log(`  ->[importer][${importer}]`.yellow);
      return null;//hello.js';
    },*/

    async generateBundle(oo, bundle, isWrite) {
      // when isWrite is "false" then it will not be immediatly written to a file
      // so basicly generateBundle is 
      console.log(`generateBundle ${cnt++}`.red);
      console.log(`  ->options:${JSON.stringify(oo)}`.yellow);
      console.log(`  ->iswrite-flag:${JSON.stringify(isWrite)}`.yellow);

      for (const [entry, value] of Object.entries(bundle)) {
        //console.log(bundle)
        console.log(`  ${entry}->[type:${value.type}][code:${value.code || value.source}]`.yellow);
      }
      if (isWrite === true) {
        console.log('EMITTING ASSET'.red);
        this.emitFile({
          type: 'asset',
          source: '<htm><head></head><body></body></html>',
          name: 'index.html',
          //fileName: 'index.html'
        });
      }
      console.log('end of generateBundle'.red);
    },
    writeBundle(bundle) {
      console.log('writeBundle'.red);
      for (const [entry, value] of Object.entries(bundle)) {
        console.log(entry, value)
      }
    }
  };
}