const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize();

const Tasks = sequelize.define('Task', {
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
    defaultValue: 5,
  },
  completed_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
})

module.exports = {
  Tasks,
}
