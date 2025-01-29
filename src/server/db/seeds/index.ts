import seedCategories from './seedCategories';
import eventsSeed from './seedEvents';
import seedInterests from './seedInterests';
import seedTasks from './seedTasks';
import seedVenues from './seedVenues';

async function seedDb() {
  await seedVenues();
  await seedCategories();
  await seedInterests();
  await seedTasks();
  eventsSeed();
}

seedDb();
