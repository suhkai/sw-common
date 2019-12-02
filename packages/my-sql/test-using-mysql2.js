'use strict';

const mysql2 = require('mysql2');

const {
    randomString,
    randomInt,
    randomDate
} = require('./random-data');

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
    ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    partition_key smallint(6) NOT NULL COMMENT 'this is will be "day of month" calculated by "data inserting process"',
    body text,
) values ? ;
`;


function generateRow() {
    
    const
        ts = randomDate(),
        partition_key = randomInt(0,19),
        route_names = randomString(400), // large string
        pid = randomInt(),
        app = randomString( 255),
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

function connectToDB() {
    const connection = mysql2.createConnection({
        host,
        user,
        password,
        port,
        database
    });
    return new Promise(resolve => {
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
    return new Promise(resolve => {
        connection.end(() => {
            resolve([undefined, undefined]);
        });
    });
}

function queryKeepAlive(connection, data){
     return new Promise(resolve => {
        connection.query(sqlInsertKeepAlive, data, (err, results, fields)=>{
            if (err){
                resolve([undefined, String(err)]);
                return;
            } 
            resolve([ { results, fields }  ,undefined]);
        });
     });   
}

function commit(connection){
    return new Promise(resolve => {
        connection.commit(err=>{
            if (err){
                resolve([undefined, String(err)]);
                return;
            }
            resolve([undefined, undefined]);
        });
    });
}

function beginTransaction(connection){
    return new Promise(resolve => {
        connection.beginTransaction(err=>{
            if (err){
                resolve([undefined, String(err)]);
                return;
            }
            resolve([ undefined ,undefined]);
        });
    });
}

async function test() {
    const stopWatch = createStopWatch();
    const lifeSpan = createStopWatch();
    console.log('connecting....');
    let connection;
    let error;
    let results;
    [connection, error] = await connectToDB();

    if (error) {
        console.error(`Connection could not be made ${String(error)}`);
        return;
    }
    lifeSpan.reset();
    let ts = lifeSpan.peek();
    while (ts < 1E100){
        ts = lifeSpan.peek();
        await beginTransaction(connection);
        const data = [Array.from({ length: 1000 }).map(() => generateRow())];
        stopWatch.reset();
        [results, error] = await queryKeepAlive(connection, data);
        if (error){
            console.error(` ${String(error)}`);
            continue;
        }
        console.log(results.results);
        console.log(`duration: ${stopWatch.peek()} ms`)
        await commit(connection);
    }
    await closeConnection(connection);
    console.log('db connection closed');
}

test(); // 