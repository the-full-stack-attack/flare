const Sequelize = require('sequelize');
const { database } = require('../index.ts');
const { User } = require('../index.ts');

const Text = database.define('Text', {
    content: { type: Sequelize.STRING},
    isEmail: { type: Sequelize.BOOLEAN, defaultValue: true, },
    user_id: { type: Sequelize.INTEGER, },
    created_at: { type: Sequelize.DATE, },
});

Text.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Text, { foreignKey: 'user_id' });

module.exports = {
    Text,
};