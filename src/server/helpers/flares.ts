import s3Client from '../../../aws-config';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import Notification from '../db/models/notifications';
import Flare from '../db/models/flares';
import User_Flare from '../db/models/users_flares';
import User_Notification from '../db/models/users_notifications';
import Conversation_Session from '../db/models/conversation_session';

dotenv.config();

const { S3_BUCKET_NAME } = process.env;

// This helper will be used to send users flare notifications
// If we know the name use sendFlareByName(flareName)
// If we need to find the Flare use findFlare(type, milestone)
// Once theFlare is found we can pass the flare into sendFlareObject()

type UserType = {
  id: number;
  username?: string;
  google_id?: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  total_tasks_completed: number;
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
type UseFlareType = {
  UserId: number;
  FlareId: number;
};
/*** Function checks if flares need to be sent and sends them if necessary
 * I: Optional String of the flare name to be sent, user object
 * O: n/a
 * C: Give user correct flare and send notification
 * E: n/a
 */
async function checkForFlares(user: UserType, flareName: string | void) {
  const { id } = user;
  if (!user && !flareName) {
    console.error('User and flare were both undefined in sendFlare helper');
    return;
  }
  // If the flareName is given then we know the name of the flare to send
  if (flareName) {
    sendFlareByName(flareName);
    return;
  }
  if (user.total_tasks_completed === 1) {
    sendFlareByName('Go Getter');
  } else if (
    user.total_tasks_completed % 5 === 0 &&
    user.total_tasks_completed !== 0
  ) {
    const tasksCompleted = user.total_tasks_completed;
    findFlare('Task Flare', tasksCompleted, user);
  }
  try {
    const savedConversations = await Conversation_Session.findAll({
      where: { user_id: id },
    });
    if (savedConversations.length === 3) {
      sendFlareByName('Stored Thoughts(x3)');
    }
  } catch (err) {
    console.error('Error finding Conversation_Sessions for user: ', err);
    return;
  }
  // Helper Function for if we know the name of the flare to send before the object is received
  async function sendFlareByName(flare: string) {
    try {
      const flareToSend: any = await Flare.findOne({
        where: { name: flare },
      });
      if (flareToSend) {
        // Pass the flare and user into the sendFlareObject function
        sendFlareObject(flareToSend, user);
        return;
      } else {
        console.error(
          'Could not find the flare using the name in sendFlare helper'
        );
        return;
      }
    } catch (err) {
      console.error(
        'Error when trying to send the flare in sendFlare helper: ',
        err
      );
    }
  }
}
// Function to find and sendFlare
async function findFlare(type: string, milestone: number, user: UserType) {
  try {
    const flareToSend: any = await Flare.findOne({
      where: { type, milestone },
    });
    if (flareToSend) {
      sendFlareObject(flareToSend, user);
      return;
    } else {
      console.error(
        `Flare of ${type} ${milestone} could not be found in findFlare`
      );
    }
  } catch (err) {
    console.error('Error in findFlare: ', err);
  }
}
/***
 * I: Flare object
 * O: n/a
 */
// Function to send the flare once the whole object is found and it is confirmed the user doesn't have the flare yet
async function sendFlareObject(flare: FlareType, user: UserType) {
  try {
    const userHasFlare: any = await alreadyGiven(flare, user);
    if (userHasFlare) {
      console.log(`${user.username} was already given the ${flare.name} flare`);
      return;
    }
    const flareId = flare.id;
    const userId = user.id;
    if (flare) {
      // Create user_flare row
      await User_Flare.create({
        UserId: userId,
        FlareId: flareId,
      });
      // Create notification object and add it to the database
      const { achievement } = flare;
      // Create the sendTime for the notification to be sent 3 seconds from now
      const now = Date.now();
      const sendTime = new Date(now + 3000);
      const newNotification = {
        message: achievement,
        send_time: sendTime,
      };
      const notification: any = await Notification.create(newNotification);
      const notificationId = notification.id;
      // Create user_notification row
      await User_Notification.findOrCreate({
        where: { UserId: userId, NotificationId: notificationId },
      });
    } else {
      console.error(
        'Could not find the flare using the name in sendFlare helper'
      );
      return;
    }
  } catch (err) {
    console.error(
      'Error when trying to send the flare in sendFlare helper: ',
      err
    );
  }
}

// Function makes sure the user doesn't already have the flare
function alreadyGiven(
  flare: FlareType,
  user: UserType
): Promise<boolean | void> {
  const flareId = flare.id;
  const userId = user.id;
  return User_Flare.findOne({
    where: { UserId: userId, FlareId: flareId },
  })
    .then((userFlare) => {
      if (userFlare) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.error('Error finding flare in alreadyGiven: ', err);
    });
}

// Helper to retrieve the Flare image from the bucket
const getImageUrl = async (imageKey: string): Promise<string> => {
  // Create the command with the imageKey
  const getCommand = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: imageKey,
  });
  try {
    const url: string = await getSignedUrl(s3Client, getCommand);
    return url;
  } catch (err) {
    console.error('Error in getImage helper for s3 bucket: ', err);
    throw err;
  }
};

export { checkForFlares, getImageUrl };
