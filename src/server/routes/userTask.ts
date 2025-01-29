import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import User_Task from '../db/models/users_tasks';
import Task from '../db/models/tasks';
import User from '../db/models/users';

const userTaskRouter = Router();

// GET requests to /api/userTask/:id
userTaskRouter.get('/:id', async (req: any, res: Response) => {
  // Grab the user's id from the req.params
  const { id } = req.params;
  const users = await User.findOne({
    where: { id },
    include: [Task, User_Task],
  });
  console.log('Users: ', users);

  // Find all the user's completed tasks in the user_task table
  User_Task.findAll({
    where: { UserId: id },
    include: { model: Task, where: { completed: true } },
  })
    .then((userTasks) => {
      if (!userTasks) {
        res.sendStatus(404);
      } else {
        // console.log('UserTasks found: ', userTasks);
        res.status(200).send(userTasks);
      }
    })
    .catch((err: any) => {
      console.error('Error finding the userTasks: ', err);
      res.sendStatus(500);
    });
});

export default userTaskRouter;
