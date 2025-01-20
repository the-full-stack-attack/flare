const Sequelize = require('Sequelize');
const { database } = require('../index.ts');
const { Event, Chat } = require('./index.ts');

const Chatroom = database.define('Chatroom', {
    map: { type: Sequelize.STRING, },
    event_id: { type: Sequelize.INTEGER, },
});

Chatroom.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasOne(Chatroom, { foreignKey: 'event_id' });

module.exports = {
    Chatroom,
};