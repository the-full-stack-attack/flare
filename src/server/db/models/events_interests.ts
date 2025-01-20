const Sequelize = require('sequelize');
const { database } = require('../index.ts');
const { Event, Interest } = require('../index.ts');

const Event_Interest = database.define('Event_Interest', {
    event_id: { type: Sequelize.INTEGER },
    interest_id: { type: Sequelize.INTEGER },
});

Event.belongsToMany(Interest, { through: Event_Interest });
Interest.belongsToMany(Event, { through: Event_Interest });

module.exports = {
    Event_Interest,
};