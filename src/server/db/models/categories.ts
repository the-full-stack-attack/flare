const Sequelize = require('sezuelize');
const database = require('../index.ts');

const Category = database.define('Category', {
    name: { type: Sequelize.STRING },
})

module.exports = {
    Category,
}