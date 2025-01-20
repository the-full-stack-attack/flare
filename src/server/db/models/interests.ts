const Sequelize = require('sequelize');
const { database } = require('../index.ts');

const Interest = database.define('Interest', {
    name: { type: Sequelize.STRING },
})

module.exports = {
    Interest,
};