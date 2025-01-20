const Sequelize = require('sequelize');
const { database } = require('../index.ts');
const { User, Event } = require('./index.ts');

const User_Event = database.define('User_Event', {
    user_id: { type: Sequelize.INTEGER },
    event_id: { type: Sequelize.INTEGER },
    user_attended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    private_review: { type: Sequelize.STRING(250) },
    public_review: { type: Sequelize.STRING(250) },
})

User.belongsToMany(Event, { through: User_Event });
Event.belongsToMany(User, { through: User_Event });

module.exports = {
    User_Event,
};