import Sequelize from 'sequelize';
import database from '../index';
import User_Avatar from './users_avatars';

const User = database.define('User', {
  username: { type: Sequelize.STRING(20) },
  google_id: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING },
  full_name: { type: Sequelize.STRING },
  phone_number: { type: Sequelize.STRING(10) },
  total_tasks_completed: { type: Sequelize.INTEGER, defaultValue: 0 },
  weekly_task_count: { type: Sequelize.INTEGER, defaultValue: 0 },
  last_week_task_count: { type: Sequelize.INTEGER, defaultValue: 0 },
  events_attended: { type: Sequelize.INTEGER },
  location: { type: Sequelize.STRING },
  avatar_uri: { type: Sequelize.TEXT, },
});

User.hasOne(User_Avatar);
User_Avatar.belongsTo(User);

export default User;
