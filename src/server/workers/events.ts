import cron from 'node-cron';
import { Op } from 'sequelize';
import Event from '../db/models/events';
import User_Event from '../db/models/users_events';

type UserEventsArr = UserEvent[];

type UserEvent = {
  user_attended: Boolean;
  user_attending: Boolean;
  private_review: String | void;
  public_review: String | void;
  UserId: Number;
  EventId: Number;
}

cron.schedule('0,29 * * * *', async () => {
  // Grab the events that have started in the last hour
  const now = Date.now();
  const events: any = await Event.findAll({ where: {
    start_time: {
      [Op.between]:  [new Date(now - 1000 * 60 * 61), new Date(now)],
    }
  }});
  // Find all the user_events for each event
  events.forEach((event: any) => {
    console.log('Current event: ', event);
    updateUserAttended(event.id);
  })
  // Update the user_attended to true
})

/***
 * Helper to update the user_events user_attended
 * I: EventId
 * O: n/a
 */
async function updateUserAttended(eventId: number): Promise<void> {
  const userEvents: any = await User_Event.findAll({ where: { EventId: eventId, user_attending: true }});
  // Change each userEvents element user_attended to true
  userEvents.forEach(async (userEvent: any) => {
    console.log('EventId: ', eventId);
    console.log('Current userEvent: ', userEvent);
    userEvents.user_attended = true;
    await userEvent.save();
  })
}