import { Router, Request, Response } from 'express';
import User from '../db/models/users';

const userRouter = Router();

// GET request to /api/user
userRouter.get('/', (req: any, res: Response) => {
  const { id } = req.user;
  User.findByPk(id)
    .then((user) => {
      if (!user) {
        res.sendStatus(400);
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      console.error('Error finding user: ', err);
    });
});

export default userRouter;
