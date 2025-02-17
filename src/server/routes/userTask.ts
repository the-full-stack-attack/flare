import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import User_Task from '../db/models/users_tasks';
import Task from '../db/models/tasks';
import User from '../db/models/users';

const userTaskRouter = Router();

// GET requests to /api/userTask/complete/:id
userTaskRouter.get('/complete/:id', async (req: any, res: Response) => {
  // Grab the user's id from the req.params
  const { id } = req.params;
  User_Task.findAll({
    where: { UserId: id, completed: true },
    order: [['createdAt', 'DESC']],
    include: [Task],
  })
    .then((userTasks) => {
      if (!userTasks) {
        res.sendStatus(404);
      } else {
        res.status(200).send(userTasks);
      }
    })
    .catch((err: any) => {
      console.error('Error finding the userTasks: ', err);
      res.sendStatus(500);
    });
});

// GET requests to /api/userTask/optOut/:id
userTaskRouter.get('/optOut/:id', async (req: any, res: Response) => {
  // Grab the user's id from the req.params
  const { id } = req.params;
  User_Task.findAll({
    where: { UserId: id, opted_out: true },
    order: [['createdAt', 'DESC']],
    include: [Task],
  })
    .then((userTasks) => {
      if (!userTasks) {
        res.sendStatus(404);
      } else {
        res.status(200).send(userTasks);
      }
    })
    .catch((err: any) => {
      console.error('Error finding the userTasks: ', err);
      res.sendStatus(500);
    });
});

export default userTaskRouter;
