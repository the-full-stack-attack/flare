import { DataTypes } from 'sequelize';
import database from '../index';
import User from './users';

const Task = database.define('Task', {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty_rating: {
    // TINYINT UNSIGNED has a range of -128 to 127 because it is being mapped to TINYINT
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 5,
  },
  completed_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Task.hasMany(User, { foreignKey: 'current_task_id', as: 'users' });
// Put a currentTask property on the User that points to the Task
User.belongsTo(Task, { foreignKey: 'current_task_id', as: 'currentTask' });

export default Task;
