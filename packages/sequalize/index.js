const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    {
        storage: 'path/to/chinook.db',
        dialect: 'sqlite'
    }
);

/**
 * ER symbols
 * --|--  one
 * --<-- many
 * --|-|-  one and only one
 * --O|- zero or one
 * -- |<-- one or many
 * -- 0<-- zero or many
 */

function defineModels() {
    class MediaTypes extends Model { };
    // media_types
    // MediaTypeId: INTEGER
    // Name: NVARCHAR(120) -- no diff between VARCHAR and NVARCHAR for sqlite, the [N] means non ascii, aka utf8
    MediaTypes.init({
        MediaTypeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        Name: DataTypes.STRING(120)
    }, { sequelize, modelName: 'media_types', timestamps: false, });

    class Genres extends Model { };
    // genres
    // GenreId: INTEGER
    // Name: NVARCHAR(120)
    Genres.init({
        GenreId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        Name: DataTypes.STRING(120),
        ['hello_world']: DataTypes.STRING,
    }, { sequelize, modelName: 'genres', timestamps: false, });

    class Tracks extends Model { };
    // tracks
    // TrackId: INTEGER
    // Name: NVARCHAR(120)
    Tracks.init({
        TrackId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        Name: DataTypes.STRING(200),

    }, { sequelize, modelName: 'tracks', timestamps: false });

    Tracks.hasOne(Tracks, { as: 'subTrack', foreignKey: 'subTrackId' });

    Genres.hasMany(Tracks, { foreignKey: 'GenreId', targetKey: 'hello_world' });
    MediaTypes.hasMany(Tracks, { foreignKey: 'MediaTypeId' });

    return { MediaTypes, Genres };
}


sequelize.authenticate()
    .then(async () => {
        console.log('connection established');
        // define models i guess
        defineModels();
        await sequelize.sync()


        //await sequelize.close();
    })
    .catch(err => {
        console.log('error', err)
    });

// reading this: https://sequelize.org/v5/manual/models-definition.html