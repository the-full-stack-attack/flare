import Sequelize from 'sequelize';
import database from '../index';
import User from './users';

const Task = database.define('Task', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  difficulty: {
    // TINYINT UNSIGNED has a range of -128 to 127 because it is being mapped to TINYINT
    type: Sequelize.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 3,
  },
  completed_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

Task.hasMany(User, { foreignKey: 'current_task_id', as: 'users' });
// Put a currentTask property on the User that points to the Task
User.belongsTo(Task, { foreignKey: 'current_task_id', as: 'currentTask' });

export default Task;
