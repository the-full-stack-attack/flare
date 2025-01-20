const Sequelize = require('sequelize');
const { database } = require('../index.ts');
const { User, Notification } = require('./index.ts');

const User_Notification = database.define('User_Notification', {
    user_id: { type: Sequelize.INTEGER, },
    notification_id: { type: Sequelize.INTEGER, },
});

User.belongsToMany(Notification, { through: UserNotification });
Notification.belongsToMany(User, { through: UserNotification });

module.exports = {
    User_Notification,
;}