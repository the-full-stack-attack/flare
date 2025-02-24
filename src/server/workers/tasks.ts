import { Op } from 'sequelize';
import cron from 'node-cron';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import Task from '../db/models/tasks';
import User from '../db/models/users';

dotenv.config();

const { GEMINI_API_KEY } = process.env;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `Help me seed a MySQL database with tasks by returning an array of JSON objects. The tasks should require
  the person to leave their house. The tasks should be non-specific in the sense that anyone should be able to complete it
  Do not tell the person how to get to the task destination, simply state where to go for the task. Take into consideration
  the day of the week and that people may have other responsibilities on weekdays. The objects should
  have the following properties: description is a task for the user to do in order to get out of the house,
  type is a category of task, difficulty is either 1, 2, 3, 4, or 5, completed_count is 0, and date is a provided date in ISO string format.`
});

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
// Create the chat so that messages are remembered by the model
const chat = model.startChat({
  history: [],
  generationConfig: {
    temperature: 0.4,
    topP: 0.3,
  }
})
// Variable to keep track of creation attempts
let creationRunCount: number = 0;
// Function to generate tasks for the day
const createTasks = () => {
  console.log('Running createTasks');
  const now: Date = new Date(); // Gets current local date and time
  // Convert now to Midnight UTC
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString();
  const prompt = `Provide me new tasks for the categories of Active, Fun, Normal, Duo, and Rejection Therapy with the date of ${date} in ISO string format. I need one task for each difficulty
  level for every category. For the rejection therapy tasks, the 'type' property should be 'Rejection'.`;
  chat
    .sendMessage(prompt)
    .then(async (result: any) => {
      const tasks = await parseTasks(result.response.text());
      Task.bulkCreate(tasks || [{}])
        .then(() => {
          console.log('Tasks successfully created!');
        })
        .catch((err) => {
          creationRunCount += 1;
          if (creationRunCount <= 5) {
            console.error('createTasks failed, trying again');
            createTasks();
          } else {
            console.error ('Create tasks failed too many times in bulkCreate: ', err);
          }
        });
    })
    .catch((err: any) => {
      creationRunCount += 1;
          if (creationRunCount <= 5) {
            console.error('createTasks failed, trying again');
            createTasks();
          } else {
            console.error ('Create tasks failed too many times due to Gemini: ', err);
          }
    });
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
