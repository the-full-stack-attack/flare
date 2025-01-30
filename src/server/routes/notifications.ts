import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';

import User from '../db/models/users';
import User_Notification from '../db/models/users_notifications';
import Notification from '../db/models/notifications';

const notifsRouter = Router();

/*
  GET /api/notifications => Get notifications for the user
*/
notifsRouter.get('/', (req: any, res: Response) => {
  const notifWhere: any = { send_time: { [Op.lt]: new Date(Date.now()) } };

  // Check if a query has a `seen` key, filter results based on `seen` in User_Notification
  if (req.query.seen) {
    if (req.query.seen === 'false') {
      notifWhere['$Notifications.User_Notification.seen$'] = false;
    }
    if (req.query.seen === 'true') {
      notifWhere['$Notifications.User_Notification.seen$'] = true;
    }
  }

  User.findOne({
    where: {
      id: req.user.id,
    },
    include: [
      {
        model: Notification,
        where: notifWhere,
        required: false,
      },
    ],
    order: [
      // Order matters: First check seen, then order by send_time
      [Notification, User_Notification, 'seen', 'ASC'],
      [Notification, 'send_time', 'DESC'],
    ],
  })
    .then((userData) => {
      res.status(200).send(userData?.dataValues.Notifications);
    })
    .catch((err: unknown) => {
      console.error('Failed to GET /api/notifications', err);
      res.sendStatus(500);
    });
});

/*
  PATCH /api/notifications/seen/all =>
*/
notifsRouter.patch('/seen/all', (req: any, res: Response) => {
  // Query User_Notifications table for all user notifs update all seen to true
  User_Notification.update({ seen: true }, { where: { UserId: req.user.id } })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: unknown) => {
      console.error('Failed to PATCH /api/notifications/seen/all', err);
      res.sendStatus(500);
    });
});

/*
  DELETE /api/notifications/:id => Delete one notification for a user
*/
notifsRouter.delete('/:id', (req: any, res: Response) => {
  User_Notification.destroy({
    where: {
      UserId: req.user.id,
      NotificationId: req.params.id,
    },
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: unknown) => {
      console.error('Failed to DELETE /api/notifications/:id', err);
      res.sendStatus(500);
    });
});

/*
  DELETE /api/notifications/all => Delete all notifications for a user
*/

export default notifsRouter;
