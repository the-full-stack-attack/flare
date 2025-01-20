const { User } = require('./users.ts');
const { Task } = require('./tasks.ts');
const { User_Task } = require('./users_tasks.ts');
const { Interest } = require('./interests.ts');
const { User_Event } = require('./users_events.ts');
const { User_Interest } = require('./users_interests.ts');
const { Venue } = require('./venues.ts');
const { Event } = require('./events.ts');
const { Event_Interest } = require('./events_interests.ts');
const { Event_Category } = require('./events_categories.ts');



module.exports = {
  User,
  Task,
  User_Task,
  Interest,
  User_Interest,
  Event,
  Event_Category,
  Event_Interest,
  User_Event,
  Venue,
}
