import { Op } from 'sequelize';
import cron from 'node-cron';
import User_Event from '../db/models/users_events';
import Event from '../db/models/events';
import { findFlare } from '../helpers/flares';

/***
 * This worker will be in charge of checking to see if a user has earned an event flare
 * Steps:
 * => See what events are occurring and grab the ids
 * => Use the event id to grab the users attending those events
 * => Check how many events that user has attended before
 */

cron.schedule('30 * * * *', async () => {
  // Create a Date to query by
  const now: number = Date.now();
  // Find all the events that have started in the last hour
  const events: any = await Event.findAll({
    where: {
      start_time: {
        [Op.between]: [new Date(now - 1000 * 60 * 61), new Date(now)],
      },
    },
  });
  // Use the events id to find the users attending
  // Check how many events the user has attended in the past
});
