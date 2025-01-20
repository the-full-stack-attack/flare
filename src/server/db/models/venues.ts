const Sequelize = require('sequelize');
const database = require('../index.ts');
const { Event } = require('./index.ts');

const Venue = database.define('Venue', {
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
});

Venue.hasMany(Event, { foreignKey: 'venue_id' });


module.exports = {
    Venue,
}