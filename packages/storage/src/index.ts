import { verbose } from 'sqlite3';

const db = new (verbose()).Database(':memory:', err => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});

db.close();
