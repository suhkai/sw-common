const { resolve } = require('path');
const sql3 = require('sqlite3').verbose();

function opendb(options) {
    return new Promise(resolve => {
        const Database = sql3.Database;
        const db = new Database(options, sql3.OPEN_CREATE | sql3.OPEN_READWRITE , err => {
            if (err) {
                resolve([undefined, String(err)]);
                return;
            }
            resolve([db, undefined]);
        });
    });
};

function close(db) {
    return new Promise(resolve => {
        db.close(err => {
            if (err) {
                resolve([undefined, String(err)]);
                return
            }
            resolve([true, undefined]);
        });
    });
}

function all(db, sql, params){
    return new Promise(resolve=>{
        db.all(sql, params, (err, rows)=>{
            if (err){
                resolve([undefined, err]);
                return;
            }
            resolve([rows, undefined]);
        });
    });
}

async function init() {
    let db;
    let error;
    let row;
    const fullPath = resolve('path/to/chinook.db');
    console.log(`fullPath: ${fullPath}`);
    [db, error] = await opendb(fullPath);
    if(error){
        console.error(`there was an  error during open ${error}`);
        return;
    }
    console.log('db open');
    const sql =  `SELECT DISTINCT Name as name FROM playlists ORDER BY name`;
  
    [rows, error] = await all(db, sql, []);
    if(error){
        console.error(`there was an error during sql ${error}`);
        return;
    }
    console.log(JSON.stringify(rows));

    [,error] = await close(db);
    if(error){
        console.error(`there was an error during close ${error}`);
        return;
    }
    console.log('db closed');
}

init();


