import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import User from '../db/models/users';
import Task from '../db/models/tasks';
import User_Task from '../db/models/users_tasks';

const taskRouter = Router();

type UserType = {
  id: number;
  username?: string;
  google_id?: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  total_tasks_complete?: number;
  current_task_id?: number;
};

/* GET requests to /api/task/:id
 * Comes from the Dashboard view and Task view
 */
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

/* POST requests to /api/task
 * Comes from ChooseTask component on the 'choose task' button click
 * Creates a user_task row for the specified user with the specified task
 */
taskRouter.post('/', async (req: any, res: Response) => {
  try {
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
  } catch (err) {
    console.error('Error in POST to /api/task: ', err);
    res.sendStatus(500);
  }
});

/* PATCH requests to /api/task/optOut/:id
 * Comes from TaskDisplay component 'opt out' button click
 * Sets user's current_task id to null
 * Sets the corresponding use _task opted_out column to true
 */
taskRouter.patch('/optOut/:id', async (req: any, res: Response) => {
  try {
    // Get user's id from req.params
    const taskId = req.params.id;
    // Get taskId from  req.body
    const { userId }: { userId: number } = req.body;
    const user: any = await User.findByPk(userId);
    const userTask: any = await User_Task.findOne({
      where: { UserId: userId, TaskId: taskId },
    });
    if (user && userTask) {
      user.current_task_id = null;
      await user.save();
      userTask.opted_out = true;
      await userTask.save();
      res.status(200).send(user);
    } else {
      console.error('Could not find user or userTask');
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('Error in PATCH to /api/task/:id: ', err);
    res.sendStatus(500);
  }
});

/* PATCH requests to /api/task/complete
 * Comes from TaskDisplay component 'complete' button click
 * Sets user's current_task id to null
 * Sets the corresponding use _task complete column to true
 * User's total_tasks_completed and task's completed_count are incremented
 * User_task date_completed is updated
 */
taskRouter.patch('/complete', async (req: any, res: Response) => {
  try {
    const { userId, taskId } = req.body.ids;
    const user: any = await User.findByPk(userId);
    const task: any = await Task.findByPk(taskId);
    const userTask: any = await User_Task.findOne({
      where: { UserId: userId, TaskId: taskId },
    });
    if (user && task && userTask) {
      user.current_task_id = null;
      user.total_tasks_completed += 1;
      user.weekly_task_count += 1;
      await user.save();
      task.completed_count += 1;
      await task.save();
      userTask.completed = true;
      const date = dayjs().format('MM/DD/YYYY');
      const newDate = dayjs(date);
      userTask.date_completed = newDate;
      await userTask.save();
      res.status(200).send(user);
    } else {
      console.error('user, task, or userTask was not found in PATCH');
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('Error in PATCH to /api/task: ', err);
    res.sendStatus(500);
  }
});

/** PATCH requests to /api/task/retry
 * Comes from the OptOutTask component 'retry' button click
 */
taskRouter.patch('/retry', async (req: any, res: Response) => {
  try {
    // Grab UserId and TaskId fro req.body
    const { UserId, TaskId } = req.body.ids;
    const user: any = await User.findByPk(UserId);
    const userTask: any = await User_Task.findOne({
      where: { UserId, TaskId },
    });
    if (user && userTask) {
      user.current_task_id = TaskId;
      await user.save();
      userTask.opted_out = false;
      await userTask.save();
      res.status(200).send(user);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('Error in findByPk in PATCH to /api/task/retry', err);
    res.sendStatus(500);
  }
});

export default taskRouter;
