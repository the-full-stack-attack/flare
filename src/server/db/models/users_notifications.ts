import Sequelize from 'sequelize';
import database from '../index';
import User from './users';
import Notification from './notifications';

const User_Notification = database.define('User_Notification', {
  seen: { type: Sequelize.BOOLEAN, defaultValue: false },
});

User.belongsToMany(Notification, { through: User_Notification });
Notification.belongsToMany(User, { through: User_Notification });

User_Notification.belongsTo(User, { onDelete: 'CASCADE' });
User_Notification.belongsTo(Notification, { onDelete: 'CASCADE' });

export default User_Notification;
