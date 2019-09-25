import { verbose } from 'sqlite3';

import {lstat} from 'fs';

const db = new (verbose()).Database(':memory:');

console.log('hello world', db, lstat);

db.close();
