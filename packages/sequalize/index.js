const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    {
        storage: 'path/to/database.sqlite',
        dialect: 'sqlite'
    }
);

sequelize.authenticate()
    .then(async () => {
        console.log('connection established');
        class User extends Model { }
        User.init({
            username: DataTypes.STRING,
            birthday: DataTypes.DATE
        }, { sequelize, modelName: 'user' });

        await sequelize.sync()
        const jane = await User.create({
                username: 'janedoe',
                birthday: new Date(1980, 6, 20)
            });
        console.log(jane.toJSON());
        await User.update({lastName: "Doe"}, { where: { lastName:null }});
        console.log(User.get('lastName'));
        await sequelize.close();
    })
    .catch(err => {
        console.log('error', err)
    });

// reading this: https://sequelize.org/v5/manual/models-definition.html