import { Op } from 'sequelize';
import cron from 'node-cron';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import Task from '../db/models/tasks';
import User from '../db/models/users';

dotenv.config();

const { GEMINI_API_KEY } = process.env;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Helper to parse the GoogleGenerativeAI response
const parseTasks = (text: any) => {
  // Clean the text of unwanted tokens
  const tasks = text.trim().replace(/^```json\s*|```\s*$/g, '');
  // Parse the tasks
  const tasksArr = JSON.parse(tasks);
  if (!Array.isArray(tasksArr)) {
    console.error('Couldnt parse the array');
    return null;
  }
  return tasksArr;
};

const resetTasks = async () => {
  console.log('Resetting current_task_ids');
  await User.update(
    { current_task_id: null },
    {
      where: {
        current_task_id: {
          [Op.ne]: null,
        },
      },
    }
  );
};
// Function to generate tasks for the day
const createTasks = () => {
  console.log('Running resetTasks');
  const day = dayjs().day();
  const today = dayjs().format('MM/DD/YYYY');
  const date = dayjs(today);
  const prompt = `I am seeding a MySQL database and need the tasks formatted as JSON objects. Please return a JSON array that can be parsed into an array of objects. The objects should
have the following properties: description is a task for the user to do in order to get out of the house,
type is a category of task, difficulty is either 1, 2, 3, 4, or 5, completed_count is 0, and date is ${date}. The type options are:
Active, Fun, Normal, Duo, and Rejection Therapy. For each type of task, please provide a task for every difficulty level.
The task should not take more than 60 minutes, but should require the person to leave their house. The tasks should be non specific in the sense that anyone should be able to complete it.
Take into consideration that most places are not within walking distance for many people. Do not provide tasks that include illegal activity. Do not tell people how to reach a destination, 
just tell them to go to where the task will take place.`;
  model
    .generateContent(prompt)
    .then(async (result: any) => {
      const tasks = await parseTasks(result.response.text());
      Task.bulkCreate(tasks || [{}])
        .then(() => {
          console.log('Tasks successfully created!');
        })
        .catch((err) => {
          console.error('Error bulk creating tasks: ', err);
        });
    })
    .catch((err: any) => {
      console.error('Error from gemini: ', err);
    });
};

type UserType = {
  id: number;
  username: string;
  google_id?: number;
  email?: string;
  full_name?: string;
  phone_number?: string;
  total_tasks_completed: number;
  weekly_task_count: number;
  last_week_task_count: number;
  events_attended?: number;
  location?: string;
  avatar_id?: number;
  avatar_shirt?: string;
  avatar_pants?: string;
  createdAt?: Date;
  updatedAt?: Date;
  current_task_id: number;
};
// Function to switch weekly_task_count and last_week_task_count values on every user
const resetCounts = async () => {
  console.log('Switching task counts for a new week');
  // Find all the user
  const users: any = await User.findAll();
  // Switch the last_week_task_count to the weekly_task_count of each user
  users.forEach(async (user: any) => {
    user.last_week_task_count = user.weekly_task_count;
    user.save();
    user.weekly_task_count = 0;
    user.save();
  });
};
/* Use node-cron to schedule the workers
 * Cron expression for everyday at midnight 0 0 * * *
 * Cron expression for 12 am on monday 0 0 * * 1 OR 0 0 * * MON
 */
cron.schedule('0 0 * * *', () => {
  resetTasks();
  createTasks();
});

cron.schedule('0 0 * * MON', () => {
  resetCounts();
});

export default resetTasks;
