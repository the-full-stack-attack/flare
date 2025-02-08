import seedCategories from './seedCategories';
import seedInterests from './seedInterests';
import seedTasks from './seedTasks';
import seedVenues from './seedVenues';

/***
 * Run this file with npm run seed
 * In order for the seed to work you must
 *  1. Drop the flare database (if it exists)
 *  2. Recreate the flare database
 *  3. Start/Restart the server so the models are read
 * Because the seedEvents script relies on the seed script, you must the seed script first
 */

async function seedDb() {
  await seedVenues();
  await seedCategories();
  await seedInterests();
  await seedTasks();
}

seedDb();
