import database from '../index';
import Notification from '../models/notifications';
import User_Notification from '../models/users_notifications';

const clearNotifications = async () => {
  try {
    const notifications = await Notification.findAll();
    const userNotifications = await User_Notification.findAll();

    const clearAllNotifications = async () => {
      for (let notif of notifications) {
        await notif.destroy();
      }

      for (let notif of userNotifications) {
        await notif.destroy();
      }
    };

    await clearAllNotifications();

    console.log('Notifications cleared.');
  } catch (err: unknown) {
    console.error('Failed to clearNotifications:', err);
  }
};

export default clearNotifications;
