import { Router, Request, Response } from 'express';
import User from '../db/models/users';
import Task from '../db/models/tasks';
import User_Task from '../db/models/users_tasks';

const taskRouter = Router();

// GET requests to /api/task/:id
taskRouter.get('/:id', (req: any, res: Response) => {
  const { id } = req.params;
  Task.findByPk(id)
    .then((task) => {
      if (task) {
        res.status(200).send(task);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Error finding task byPk: ', err);
      res.sendStatus(500);
    });
});

// POST requests to /api/task
taskRouter.post('/', async (req: any, res: Response) => {
  const { type, difficulty, date, userId } = req.body.taskInfo;
  // Find the task corresponding to the req.body values
  const task: any = await Task.findOne({
    where: { type, difficulty, date },
  });
  if (!task) {
    res.sendStatus(404);
  } else {
    const taskId = task.id;
    // Change the user's current_task_id to the task id
    const user: any = await User.findByPk(userId);
    user.current_task_id = taskId;
    await user.save();
    await User_Task.findOrCreate({
      where: { UserId: user.id, TaskId: taskId },
    });
    res.status(201).send(task);
  }
});

export default taskRouter;
