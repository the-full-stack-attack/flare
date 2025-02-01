import seedCategories from './seedCategories';
import seedInterests from './seedInterests';
import seedTasks from './seedTasks';
import seedVenues from './seedVenues';

async function seedDb() {
  await seedVenues();
  await seedCategories();
  await seedInterests();
  await seedTasks();
}

seedDb();
