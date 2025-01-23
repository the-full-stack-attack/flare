import Sequelize from 'sequelize';
import database from '../index';
import User from './users';
import Task from './tasks';

// Join table for the users and tasks
// Need a user foreign key and a task foreign key
const User_Task = database.define('User_Task', {
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  overall_rating: {
    type: Sequelize.TINYINT.UNSIGNED,
    defaultValue: 5,
  },
  date_completed: {
    type: Sequelize.DATE,
    defaultValue: null,
  },
  opted_out: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});
// Declare the foreign key for the user id and the task id
User.belongsToMany(Task, { through: User_Task });
Task.belongsToMany(User, { through: User_Task });

export default User_Task;
