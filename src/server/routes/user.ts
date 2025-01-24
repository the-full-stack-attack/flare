import { Router } from 'express';
import User from '../db/models/users';

const userRouter = Router();

userRouter.get('/', (req: any, res: any) => {
  if (!req.user) {
    res.status(200).send({ id: 0 });
  } else {
    User.findByPk(req.user.id)
      .then((userData) => {
        res.status(200).send(userData);
      })
      .catch((err: unknown) => {
        console.error('Failed to GET /api/user', err);
        res.sendStatus(500);
      });
  }
});

export default userRouter;
