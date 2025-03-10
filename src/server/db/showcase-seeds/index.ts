import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import database from "..";
import '../models/index';
import seedCategories from "../seeds/seedCategories";
import seedInterests from "../seeds/seedInterests";
import seedFlares from './seedFlares';
import seedTasks from './seedTasks';
import seedUsers from './seedUsers';
import seedVenues from './seedVenues';
import seedEvents from './seedEvents';

dotenv.config();

const dbName = process.env.DB_NAME || 'flare';
const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';

async function showcaseSeedDB() {
  const connection = await mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
  });
  console.log('Connected to MySQL service.');
  try {
    await database.sync({ force: true });
    console.log('Database synced with models and tables cleared.')
    await seedCategories();
    await seedInterests();
    await seedFlares();
    await seedTasks();
    await seedUsers();
    await seedVenues();
    await seedEvents();
  } catch (error: unknown) {
    console.error('Error running showcase seed:', error);
  } finally {
    await connection.end();
    console.log('Connection to MySQL closed successfully.')
  }
}

showcaseSeedDB();