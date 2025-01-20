const Sequelize = require('sequelize');
const { database } = require('../index.ts');

const Venue = database.define('Venue', {
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
});



module.exports = {
    Venue,
};