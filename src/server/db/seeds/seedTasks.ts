import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import Task from '../models/tasks';

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
  type is a category of task, difficulty is either 1, 2, 3, 4, or 5, completed_count is 0, and date is a provided date.`,
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
let seedRunCount: number = 0;
const seedTasks = async () => {
  const { count, rows } = await Task.findAndCountAll();
  // Make sure the table isnt empty
  if (count && rows) {
    console.log('Table wasnt empty');
    // Clear the tasks table
    await Task.destroy({ where: { type: 'Active' } });
    await Task.destroy({ where: { type: 'Fun' } });
    await Task.destroy({ where: { type: 'Normal' } });
    await Task.destroy({ where: { type: 'Duo' } });
    await Task.destroy({ where: { type: 'Rejection' } });
  }
  const now: Date = new Date(); // Gets current local date and time
  // Convert now to Midnight UTC
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString();
  const prompt = `Provide me a task for the categories of Active, Fun, Normal, Duo, and Rejection Therapy with the date of ${date} in ISO String format. I need one task for each difficulty
  level for every category. For the rejection therapy tasks, the 'type' property should be 'Rejection'.`;
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
          seedRunCount += 1;
          if (count <= 5) {
            seedTasks();
          }
        });
    })
    .catch((err: any) => {
      console.error('Error from gemini: ', err);
      seedRunCount += 1;
      if (count <= 5) {
        seedTasks();
      }
    });
};

seedTasks();

export default seedTasks;
