const Sequelize = require('sequelize');
const { database } = require('../index.ts');
const { User, Flare, } = require('./index.ts');

const User_Flare = database.define('User_Flare', {
    user_id: { type: Sequelize.INTEGER, },
    flare_id: { type: Sequelize.INTEGER, },
});

User.belongsToMany(Flare, { through: User_Flare });
Flare.belongsToMany(User, { through: User_Flare });

module.exports = {
    User,
    Flare,
}