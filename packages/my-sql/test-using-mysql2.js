'use strict';

const mysql2 = require('mysql2');
const Timers = require('timers');// piggyback on mysql2

const {
    randomString,
    randomInt,
    randomDate,
    randomNum
} = require('./random-data');

require('colors');


const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const createStopWatch = require('./stop-watch');

const user = 'bulk_insert_user';
const password = 'Munch2019';
const database = 'bulk_insert_db_test';
const host = 'localhost';
const port = 3306;

const sqlInsertKeepAlive = `
 INSERT INTO keep_alive (
    ts,
    partition_key,
    route_names,
    pid,
    app,
    process_cpu, 
    process_memory, 
    process_uptime,
    node_version,
    pck_version,
    os_total_memory,
    os_free_memory,
    os_cpus,
    os_load0,
    os_load1,
    os_load2,	
    os_uptime
) values ? ;
`;

const sqlInsertBody = `
INSERT INTO msg_body (
    md5,
    ts,
    partition_key,
    body
) values ? ON DUPLICATE KEY UPDATE md5=md5;
`;

const sqlInsertHeader = `
INSERT INTO msg_header (
    id,
    partition_key,
    body_md5_fk,
    ts
) VALUES ? ON DUPLICATE KEY UPDATE id=uuid();
`

// limit the space of md5 hashes,to FORC collision when inserting large amounts of rows

const md5HashSet = Array.from({ length: 1E6 }).map(() => createMD5(randomString(200)));

function createMD5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

function sampleUnif(data) {
    const idx = Math.trunc(Math.random() * data.length);
    return data[idx];
}

function probTrue(p = 0.5) {
    return Math.random() < p;
}

function generateHeaderRow(md5, partition_key, ts) {
    return [
        uuidv1(),
        partition_key,
        md5,
        ts
    ];
}


function generateBodyRow() {
    const body = randomString(800 + Math.random() * 1000);
    const md5 = probTrue(0.4) ? sampleUnif(md5HashSet) : createMD5(body);
    const ts = randomDate();
    const partition_key = randomInt(0, 24);
    return [
        md5,
        ts,
        partition_key,
        body
    ];
}

function generateKeepAliveRow() {

    const
        ts = randomDate(),
        partition_key = randomInt(0, 24),
        route_names = randomString(400), // large string
        pid = randomInt(),
        app = randomString(255),
        process_cpu = randomInt() * 0.8,
        process_memory = randomInt() * 0.8,
        process_uptime = randomInt(0, 1E7),
        node_version = 'version 8',
        pck_version = 'version 0.0.9-alpha',
        os_total_memory = randomInt(),
        os_free_memory = randomInt(),
        os_cpus = randomInt(),
        os_load0 = randomInt() * 0.8,
        os_load1 = randomInt() * 0.8,
        os_load2 = randomInt() * 0.8,
        os_uptime = randomInt();
    return [
        ts,
        partition_key,
        route_names,
        pid,
        app,
        process_cpu,
        process_memory,
        process_uptime,
        node_version,
        pck_version,
        os_total_memory,
        os_free_memory,
        os_cpus,
        os_load0,
        os_load1,
        os_load2,
        os_uptime
    ];
}

function clearTimeout(connection){
    if (connection.connectTimeout){
        Timers.clearTimeout(connection.connectTimeout);
        connection.connectTimeout = null;
    }
}

function connectToDB() {
    let connection;
    try {
        connection = mysql2.createConnection({
            host,
            user,
            password,
            port,
            database
        });
        clearTimeout(connection);
        // 
    }
    catch (err) {
        clearTimeout(connection);
        return Promise.resolve([undefined, `Error during creation of 'createConnection`]);
    }
    return new Promise(resolve => {
        clearTimeout(connection);
        connection.connect(err => {
            if (err) {
                resolve([undefined, String(err)]);
                return;
            }
            resolve([connection, undefined]);
        });
    });
}


function closeConnection(connection) {
    clearTimeout(connection){
    return new Promise(resolve => {
        connection.end(() => {
            resolve([undefined, undefined]);
        });
    });
}

function queryKeepAlive(connection, data) {
    return new Promise(resolve => {
        connection.query(sqlInsertKeepAlive, data, (err, results, fields) => {
            if (err) {
                resolve([undefined, String(err)]);
                return;
            }
            resolve([{ results, fields }, undefined]);
        });
    });
}

function queryBodyMsg(connection, data) {
    return new Promise(resolve => {
        connection.query(sqlInsertBody, data, (err, results, fields) => {
            if (err) {
                resolve([undefined, String(err)]);
                return;
            }
            resolve([{ results, fields }, undefined]);
        });
    });
}

function queryHeaderMsg(connection, data) {
    return new Promise(resolve => {
        connection.query(sqlInsertHeader, data, (err, results, fields) => {
            if (err) {
                resolve([undefined, String(err)]);
                return;
            }
            resolve([{ results, fields }, undefined]);
        });
    });
}

function commit(connection) {
    return new Promise(resolve => {
        connection.commit(err => {
            if (err) {
                resolve([undefined, String(err)]);
                return;
            }
            resolve([undefined, undefined]);
        });
    });
}

function beginTransaction(connection) {
    return new Promise(resolve => {
        connection.beginTransaction(err => {
            if (err) {
                resolve([undefined, String(err)]);
                return;
            }
            resolve([undefined, undefined]);
        });
    });
}

function delay(ts) {
    return new Promise(resolve => {
        setTimeout(() => resolve(true), ts);
    });
}

async function test() {
    let substate;
    let state;
    const stopWatch = createStopWatch();
    const lifeSpan = createStopWatch();

    let connection;
    let error;
    let results;

    console.log('connecting....');

    async function _connect() {

        [connection, error] = await connectToDB();

        if (error) {
            console.log(`[mysql][con01][error][${String(error)}]`.red);
            return await _reconnect();
        }
        connection.on('error', connectionErrorEventHandler);
        connection.on('end', connectionEndHandler);
        connection.stream.on('close', streamClose);
        connection.stream.on('error', streamError);
        state = 'ready';
        return [connection, undefined];
    }

    async function _reconnect() {
        // strip events from connection object
        clearTimeout(connection){
        if (connection) {
            connection.removeListener('error', connectionErrorEventHandler);
            connection.removeListener('end', connectionEndHandler);
            connection.stream.removeListener('close', streamClose);
            connection.stream.removeListener('error', streamError);
            try {
                connection.close();
            }
            catch (error) {
                // dont care sink it
            }
        }
        console.log(`[mysql][rec01][waiting]`.yellow);
        await delay(2E3); // 2 sec
        console.log(`[mysql][rec02][waited]`.yellow);
        return await _connect(); // connect
    }

    function connectionErrorEventHandler() {
        console.log(`connection Object emitted an error event:${arguments.length}`);
    }

    function connectionEndHandler() {
        console.log(`end event received with params ${arguments.length}`);
    }

    function streamClose(hadError) {
        console.log(`[mysql][stream][close][${hadError}]`.yellow);
        _reconnect();
    }

    function streamError() {
        console.log(`[mysql][stream][error][${String(error)}]`);
    }

    [connection, error] = await _connect();
    state = 'ready';
    lifeSpan.reset();
    let ts = lifeSpan.peek();
    while (ts < 1E100) {
        ts = lifeSpan.peek();

        if (state !== 'ready') {
            console.log(`${state}/${substate} will skip begin transaction, wait 2sec`.red);
            await delay(2000);
            continue;
        }
        [, error] = await beginTransaction(connection);
        if (error) {
            state = 'trans failure'
            console.log(`Error starting a transaction ${String(error)}`.red);
            // delay it 
            continue;
        }
        const ka = [Array.from({ length: 1000 }).map(() => generateKeepAliveRow())];
        const body = [Array.from({ length: 5000 }).map(() => generateBodyRow())];

        // for each body we generate headers
        const headers = [body[0].reduce((col, b) => {
            const [md5, ts, partition_key] = b;
            const rows = Array.from({ length: 4 }).map(() => generateHeaderRow(md5, partition_key, ts));
            col.push(...rows);
            return col;
        }, [])];

        // measure keep alive inserts
        stopWatch.reset(); // start measuring
        substate = 'ka0';
        const prep1 = queryKeepAlive(connection, ka);
        const prep2 = queryBodyMsg(connection, body);
        const prep3 = queryHeaderMsg(connection, headers);


        [results, error] = await prep1;
        if (error) {
            console.error(` ${String(error)}`);
            state = 'keep Alive failure'
            continue;
        }
        else {
            console.log(results.results);
            console.log(`duration(ka): ${stopWatch.peek()} ms`.green);
        }
        substate = 'ka1';



        // measure body inserts
        // stopWatch.reset(); // start measuring
        substate = 'body0';
        [results, error] = await prep2;
        if (error) {
            console.error(`query body message failure: ${String(error)}`);
            continue;
        }
        else {
            console.log(results.results);
            console.log(`duration(msgBody): ${stopWatch.peek()} ms`.green);
        }
        substate = 'body1';

        // measure header inserts
        //stopWatch.reset(); // start measuring
        substate = 'head0';

        [results, error] = await prep3;
        if (error) {
            console.error(`query header message failure: ${String(error)}`);
            continue;
        }
        else {
            console.log(results.results);
            console.log(`duration(msgHeader): ${stopWatch.peek()} ms`.green);
        }
        substate = 'head1';


        // end this transaction
        [, error] = await commit(connection);
        if (error) {
            console.error(`commit body message failure:${String(error)}`.red);
            continue;
        }
    }
    console.log('db connection is going to close closed'.yellow);
    await closeConnection(connection);
    console.log('db connection closed'.yellow);
}

test(); // 