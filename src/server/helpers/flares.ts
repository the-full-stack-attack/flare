import User from '../db/models/users';
import Notification from '../db/models/notifications';
import Flare from '../db/models/flares';
import User_Flare from '../db/models/users_flares';
import User_Notification from '../db/models/users_notifications';

// This helper will be used to send users flare notifications

type UserType = {
  id: number;
  username?: string;
  google_id?: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  total_tasks_completed?: number;
  current_task_id?: number;
};
type FlareType = {
  id?: number;
  name: string;
  icon: string | null;
  achievement: string;
  value: number;
  type: string | void;
};
/*** Function checks if flares need to be sent and sends them if necessary
 * I: Optional String of the flare name to be sent, user object
 * O: n/a
 * C: Give user correct flare and send notification
 * E: n/a
 */
async function checkForFlares(user: UserType, flareName: string | void) {
  console.log('User: ', user);
  console.log('flareName: ', flareName);
  if (!user && !flareName) {
    console.error('User and flare were both undefined in sendFlare helper');
    return;
  }
  // If the flare name is given then we know what flare to send
  if (flareName) {
    sendFlare(flareName);
  }
  if (user.total_tasks_completed === 1) {
    sendFlare('Go Getter');
    return;
  }
// Helper Function for once we know which flare to send
// Can take in the flare object if it was already found, or the name of the flare to get from the database
async function sendFlare(flare: FlareType | string) {
  const userId = user.id;
  // If the flare argument is a string we know we only have the name
  if (typeof flare === 'string') {
    try {
      const flareToSend: any= await Flare.findOne({ where: { name: flare }});
      const flareId = flareToSend.id;
      if (flareToSend) {
      // Create user_flare row
      const userFlare = await User_Flare.create({ UserId: userId, FlareId: flareId });
      // Create notification object and add it to the database
      const { achievement } = flareToSend;
      // Create the sendTime for the notification to be sent 3 seconds from now
      const now = Date.now();
      const sendTime = new Date(now + 3000);
      const newNotification = {
        message: achievement,
        send_time: sendTime,
      }
      const notification: any = await Notification.create(newNotification);
      const notificationId = notification.id;
      // Create user_notification row
      await User_Notification.findOrCreate({ where: { UserId: userId, NotificationId: notificationId } });
      } else {
        console.error('Could not find the flare using the name in sendFlare helper');
        return;
      }
    } catch (err) {
      console.error('Error when trying to send the flare in sendFlare helper: ', err);
    }
  }
}
};


export default checkForFlares;
