import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';

import User from '../db/models/users';
import Notification from '../db/models/notifications';
import Interest from '../db/models/interests';

const userRouter = Router();

userRouter.get('/', (req: any, res: Response) => {
  if (!req.user) {
    res.status(200).send({ id: 0 });
  } else {
    User.findOne({
      where: {
        id: req.user.id,
      },
      include: [
        {
          model: Interest,
        },
        {
          model: Notification,
          where: {
            send_time: { [Op.lt]: new Date(Date.now()) },
            '$Notifications.User_Notification.seen$': false,
          },
          // Only HasMany associations support this:
          // limit: 10,
          required: false,
        },
      ],
      order: [[Notification, 'send_time', 'DESC']],
    })
      .then((userData) => {
        if (!userData) {
          res.sendStatus(404);
        } else {
          res.status(200).send(userData);
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to GET /api/user', err);
        res.sendStatus(500);
      });
  }
});

export default userRouter;
