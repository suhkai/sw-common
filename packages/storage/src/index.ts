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

db.serialize(() => {
    db.each(`SELECT DISTINCT
                pl.PlaylistId as id,
                pl.Name as name,
                tr.TrackId as trackid,
                tr.Name as trackName,
                tr.Composer as composer
             FROM 
                playlists as pl,
                playlist_track plt,
                tracks as tr
             WHERE
                pl.PlaylistId = plt.PlaylistId
            AND 
                plt.TrackId = tr.TrackId  ORDER BY 1,3 LIMIT 2`, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            const { id, name, trackid, trackName, composer } = row;
            console.log(`${id}-${trackid}\t[${name}]/[${trackName}]\t${composer}`);
        }, ()=>console.log('COMPLETED'));
});

console.log('about to close'.green);
db.close();
console.log('close issued'.red);
