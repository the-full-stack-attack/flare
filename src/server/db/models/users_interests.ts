const Sequelize = require('sequelize');
const { database } = require('../index.ts');
const { User } = require('./users.ts');
const { Interest } = require('./interests.ts');

const User_Interest = database.define('User_Interest', {
    user_id: { type: Sequelize.INTEGER, },
    interest_id: { type: Sequelize.INTEGER, },
})

User.belongsToMany(Interest, { through: User_Interest });
Interest.belongsToMany(User, { through: User_Interest });

module.exports = {
    User_Interest,
};
