'use strict';

const mkdirp = require('./utils/db/mkdirp');
const jxpath = require('@mangos/jxpath');
const getInodes = require('./utils/db/getInodes');

const findTodos = jxpath('/**/[name=/(\\.request|\\.fetching)$/]');
const findDones = jxpath('/**/[name=/\\.response/]/');

module.exports = async function engine(options, logger = console) { // linked list?

    const dir = options.cache;
    const [, error] = await mkdirp(dir);
    if (error) {
        logger.error(error);
        return;
    }
    // hydrate from disk
    const fsSystem = await getInodes(dir);
    logger.log('done reading from disk')
    const todoIterator = findTodos(fsSystem.parent, 'parent');
    const doneIterator = findDones(fsSystel.parent, 'parent');
    let done;
    do {
        const { value: step, done: done2 } = todoIterator.next();
        if (done === false){
            logger.log(step);
        }
        done = done2;

    }
    while (!done);
    logger.log('hydrating done');
    // get entryppoints
    const entries = options.entries; // array of urls
};


