import { Op } from 'sequelize';
import cron from 'node-cron';
import User_Event from '../db/models/users_events';
import Event from '../db/models/events';
import User from '../db/models/users';
import { checkForFlares, findFlare } from '../helpers/flares';

/***
 * This worker will be in charge of checking to see if a user has earned an event flare
 * Steps:
 * => See what events are occurring and grab the ids
 * => Use the event id to grab the users attending those events
 * => Check how many events that user has attended before
 */

cron.schedule('1,30 * * * *', async () => {
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
  // Use each event id to find the users attending
  events.forEach(async (event: any) => {
    // Find the user_events rows of the attending users
    const usersAttending: any = await User_Event.findAll({
      where: { EventId: event.id, user_attending: true },
    });
    for (let i = 0; i < usersAttending.length; i++) {
      const currUserId = usersAttending[i].UserId;
      // Pass the user id into the helper to see if they've earned a flare
      countUsersEvents(currUserId);
    }
  });
});

async function countUsersEvents(userId: number) {
  const user: any = await User.findOne({ where: { id: userId } });
  // Find the current user's events where user_attended is true
  const usersEvents = await User_Event.findAll({
    where: { UserId: userId, user_attended: true },
  });
  // Count the number of events the user has attended
  const userEventsCount = usersEvents.length;
  console.log(`userEventsCount = ${userEventsCount}`);
  if (userEventsCount === 1) {
    checkForFlares(user, 'The Spark');
  } else if (userEventsCount && userEventsCount % 5 === 0) {
    findFlare('Event Flare', userEventsCount, user);
  }
}
