const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize();

const Users_Tasks = sequelize.define('Users_Task', {
  user_id: {},
  task_id: {},
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  current_task: {},
  overall_rating: {},
  date_completed: {
    type: DataTypes.
    defaultValue: null,
  },
  opted_out: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
})