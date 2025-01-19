const Sequelize = require('sequelize');
const database = require('../index.ts');

const Users = database.define('Users', {
  user_id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true,
  },
  username: { type: Sequelize.STRING(20) },
  email: { type: Sequelize.STRING } ,
  full_name: { type: Sequelize.STRING },
  phone_number: { type: Sequelize.STRING(10) },
  tasks_completed: { type: Sequelize.INTEGER },
  events_attended: {type: Sequelize.INTEGER },
  location: { type: Sequelize.STRING },
  avatar_shirt: { type: Sequelize.STRING },
  avatar_pants: { type: Sequelize.STRING },

})

module.exports = {
  Users
}