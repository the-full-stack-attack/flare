// const Sequelize = require('sequelize');
// const { database } = require('../index.ts');
// const { User, Notification } = require('../index.ts');
//
// const User_Notification = database.define('User_Notification', {
//     user_id: { type: Sequelize.INTEGER, },
//     notification_id: { type: Sequelize.INTEGER, },
// });
//
// User.belongsToMany(Notification, { through: User_Notification });
// Notification.belongsToMany(User, { through: User_Notification });
//
// module.exports = {
//     User_Notification,
// };