const Sequelize = require('sequelize');
const { database } = require('../index.ts');
const { Event } = require('./events.ts');
const { Category } = require('./categories.ts');

const Event_Category = database.define('Event_Category', {
    event_id: { type: Sequelize.INTEGER, },
    category_id: { type: Sequelize.INTEGER, },
});

Event.belongsToMany(Category, { through: Event_Category });
Category.belongsToMany(Event, { through: Event_Category});

module.exports = {
    Event_Category,
};