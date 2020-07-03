'user strict';

const fs = require('fs');
const path = require('path');

const defer = Promise.prototype.then.bind(Promise.resolve());

// create directory, could fail for whatever reason
function createFile(fileName, done) {
    const options = {
        flags: 'ax', // will fail of the file exist, (this is to prevent race condition)
        emitClose: true,
    };
    /* Example of failures:
       //1   throws no exception as far as i can see, tried writing to restricted direcotry etc
       //2   examples [Error: EACCES: permission denied, open '/root/somefile']
       //3   [Error: ENOENT: no such file or directory, open '/home/jacobx/somefile']
    */
    const writeable = fs.createWriteStream(fileName, options);
    const issues = [];
    function errFn(err) {
        issues.push({ t: 'e', d: err });
    }
    function closeFn() {
        this.removeEventListener('error', errFn);
        this.removeEventListener('open', openFn);
        done(issues);
    }
    function openFn() {
        this.removeEventListener('error', errFn);
        this.removeEventListener('close', closeFn);
    }

    writeable.once('error', errFn);
    writeable.once('close', closeFn);
    writeable.once('open', openFn);
    writeable.once('ready', done(undefined, writeable));
}


// precondition "path" is absolute!
function mkdirp(path, done){
   path.basedir(path)


}

/* 
 call this multiple times,  race conditions are solved by the underlying filesystem
 since file creation is atomic
*/
function pickNewFile(base, options = { nrLogBuffers: 2, logBufferSize: 8192, domain }) {
    //fullpath, taken into account workdir
    const fullPath = path.resolve(fileName);
    // 1. am I a directory, else create dir (recursive)
    // 2. scan this directory for files with pattern data-[date]-[domain]-00000.csv
    // 3. pick the last one, and add one to it, for new file,
    // 4. fails file creation (race condition, retry next + 1)

    let statsObj;
    try {
        statsObj = await fs.lstat(fullPath);
    } catch (err) {
        if (err.code === 'ENOENT') {
            creatconsole.log(JSON.stringify(err.code));
        }
    }

    const basedir = path.dirname(fullPath);
    const ext = path.extname(fullPath);
    // read all files in the directory
    console.log(basedir)
    const entries = fs.readdirSync(basedir, { encoding: 'utf8', withFileTypes: true });
    console.log(entries);

};


init('./x')


