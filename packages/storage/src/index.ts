import { verbose } from 'sqlite3';

const db = new (verbose().Database)(':memory:');


