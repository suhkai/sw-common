import 'colors';
import { verbose } from 'sqlite3';
const sqlite3 = verbose();

let db = new sqlite3.Database('./chinook.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message.red);
    return;
  }
  console.log('Connected to the chinook database.'.yellow);
});

db.close();
