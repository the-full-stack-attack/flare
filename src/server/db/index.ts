const Sequelize = require('sequelize');
require('dotenv').config();

// Retrieve database credentials from environment variables
const dbName = process.env.DB_NAME || 'flare';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;

// Initialize Sequelize instance with environment variables
const database = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
});

// Test the database connection
database
  .authenticate()
  .then(() => {
    console.log(`Connection has been established to the '${dbName}' database.`);
  })
  .catch((err: Error) => {
    console.error(`Unable to connect to the '${dbName}' database:`, err);
  });

export default database;
