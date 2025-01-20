const { DataTypes } = require('sequelize');
const { database } = require('../index.ts');
const { Users, Task } = require('./index.ts');

// Join table for the users and tasks
// Need a user foreign key and a task foreign key
const User_Task = database.define('User_Task', {
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  current_task: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  overall_rating: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 5,
  },
  date_completed: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  opted_out: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
// Declare the foreign key for the user id and the task id
Users.belongsToMany(Task, { through: User_Task });
Task.belongsToMany(Users, { through: User_Task});

module.exports = {
  User_Task,
};
