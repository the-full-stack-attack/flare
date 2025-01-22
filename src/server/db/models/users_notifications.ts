import Sequelize from 'sequelize';
import database from '../index';
import User from './users';
import Notification from './notifications';

const User_Notification = database.define('User_Notification', {
    user_id: { type: Sequelize.INTEGER, },
    notification_id: { type: Sequelize.INTEGER, },
});

User.belongsToMany(Notification, { through: User_Notification });
Notification.belongsToMany(User, { through: User_Notification });

export default User_Notification;