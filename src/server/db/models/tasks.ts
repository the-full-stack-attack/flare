const { DataTypes } = require('sequelize');
const { database } = require('../index.ts');

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
});

module.exports = {
  Task,
};
