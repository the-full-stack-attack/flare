import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';

import User from '../db/models/users';
import User_Notification from '../db/models/users_notifications';
import Notification from '../db/models/notifications';

const notifsRouter = Router();

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
    order: [[Notification, 'send_time', 'DESC']],
  })
    .then((userData) => {
      res.status(200).send(userData?.dataValues.Notifications);
    })
    .catch((err: unknown) => {
      console.error('Failed to GET /api/notifications', err);
      res.sendStatus(500);
    });
});

export default notifsRouter;
