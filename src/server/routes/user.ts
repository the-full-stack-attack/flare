import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';

import User from '../db/models/users';

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
          association: 'Interests',
        },
        {
          association: 'Notifications',
          where: {
            send_time: { [Op.lt]: new Date(Date.now()) },
          },
          order: ['send_time', 'DESC'],
          limit: 10,
          required: false,
        },
      ],
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
