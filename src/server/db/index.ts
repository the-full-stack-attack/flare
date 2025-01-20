const { Sequelize, sequelize } = require('sequelize');

const database = new Sequelize('flare', 'root', '', {
  dialect: 'mysql'
});

database.authenticate()
  .then(() => {

    console.log('Connection has been established to the \'flare\' database.');
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the \'flare\' database:', err);
  })

module.exports = {
  database,
};
