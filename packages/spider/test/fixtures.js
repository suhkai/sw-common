function cfile(content = '') {
    return mock.file({
        content,
        atime: 0,
        ctime: 0,
        mtime: 0,
        birthtime: 0,
        mode: 0o000
    });
}

function cdir(items = {}) {
    return mock.directory({
        atime: 0,
        ctime: 0,
        mtime: 0,
        birthtime: 0,
        mode: 0o100,
        items
    });
}


const cache = {
    type: 'd',
    size: 1,
    name: '.cache',
    version: '001',
    ctx: { full: '/.cache' },
    atime: 0,
    mtime: 0,
    ctime: 0,
    btime: 0,
    mode: 64
};
const openSans = {
    type: 'd',
    size: 1,
    name: 'Open Sans',
    version: '001',
    ctx: {},
    atime: 0,
    mtime: 0,
    ctime: 0,
    btime: 0,
    mode: 64
};
const allcss = {
    type: 'f',
    size: 0,
    name: 'all.css.request',
    version: '001',
    ctx: {},
    atime: 0,
    mtime: 0,
    ctime: 0,
    btime: 0,
    mode: 0
};
const assets = {
    type: 'd',
    size: 1,
    name: 'assets',
    version: '001',
    ctx: {},
    atime: 0,
    mtime: 0,
    ctime: 0,
    btime: 0,
    mode: 64
}

const favicon = {
    type: 'f',
    size: 23,
    name: 'favicon.png.fetching',
    version: '001',
    ctx: {},
    atime: 0,
    mtime: 0,
    ctime: 0,
    btime: 0,
    mode: 0
};
const faviconReq = {
    type: 'f',
    size: 0,
    name: 'favicon.request',
    version: '001',
    ctx: {},
    atime: 0,
    mtime: 0,
    ctime: 0,
    btime: 0,
    mode: 0
};
const somefileReq = {
    type: 'f',
    size: 0,
    name: 'somefile.request',
    version: '001',
    ctx: {},
    atime: 0,
    mtime: 0,
    ctime: 0,
    btime: 0,
    mode: 0
};

const device = {
    type: 'device',
    size: 0,
    name: '',
    version:
        '001',
    ctx: {}
};
const inodes = {
    '.cache_001': cache
};
cache.parent = device;
device.children = inodes;

cache.children = {
    'favicon.request_001': faviconReq,
    'favicon.png.fetching_001': favicon,
    'assets_001': assets,
    'Open Sans_001': openSans,
    'somefile.request_001': somefileReq
};
faviconReq.parent = cache;
favicon.parent = cache;
assets.parent = cache;
openSans.parent = cache;
somefileReq.parent = cache;

openSans.children = {
    'all.css.request_001': allcss
};
allcss.parent = openSans;


module.exports.device = device;