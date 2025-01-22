import { DataTypes } from 'sequelize';
import database from '../index';

const User = database.define('User', {
  username: { type: DataTypes.STRING(20) },
  google_id: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  full_name: { type: DataTypes.STRING },
  phone_number: { type: DataTypes.STRING(10) },
  tasks_completed: { type: DataTypes.INTEGER },
  events_attended: { type: DataTypes.INTEGER },
  location: { type: DataTypes.STRING },
  avatar_id: { type: DataTypes.INTEGER },
  avatar_shirt: { type: DataTypes.STRING },
  avatar_pants: { type: DataTypes.STRING },
});

export default User;
