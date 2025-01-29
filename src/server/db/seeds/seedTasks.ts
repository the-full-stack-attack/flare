import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import Task from '../models/tasks';

dotenv.config();
const { GEMINI_API_KEY } = process.env;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Helper to parse date strings and convert them to dates using dayjs
const parseDates = (text: any): dayjs.Dayjs[] => {
  // Create an array to hold the converted dates
  const dates: dayjs.Dayjs[] = [];
  // Clean the dates of unwanted tokens
  const datesArr = JSON.parse(text.trim().replace(/^```json\s*|```\s*$/g, ''));
  // Convert each string to a date and push onto dates
  datesArr.forEach((date: string) => {
    const newDate = dayjs(date, 'MM/DD/YYYY');
    dates.push(newDate);
  });
  return dates;
};

const makeDates = () => {
  const today = new Date();
  // eslint-disable-next-line prettier/prettier
  const prompt = `With the first date being ${today}, please provide a JSON array of dates of 3 consecutive dates. Put the dates in ISO string format MM/DD/YY.`;
  return model
    .generateContent(prompt)
    .then((result: any) => parseDates(result.response.text()))
    .catch((err: any) => {
      console.error('Error generating dates: ', err);
    });
};

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

const seedTasks = async () => {
  const dates = await makeDates();
  // Add conditional logic to make sure dates is an array
  if (!dates || !Array.isArray(dates)) {
    console.error('Dates was not an array: ');
    return;
  }
  const { count, rows } = await Task.findAndCountAll();
  // Make sure the table isnt empty
  if (count && rows) {
    console.log('Table wasnt empty');
    // Clear the tasks table
    await Task.destroy({ where: { type: 'Active' } });
    await Task.destroy({ where: { type: 'Fun' } });
    await Task.destroy({ where: { type: 'Normal' } });
    await Task.destroy({ where: { type: 'Duo' } });
    await Task.destroy({ where: { type: 'Rejection Therapy' } });
  }
  dates.forEach((date: any) => {
    const prompt = `I am seeding a MySQL database and need the tasks formatted as JSON objects. Please return a JSON array that can be parsed into an array of objects. The objects should
have the following properties: description is a task for the user to do in order to get out of the house,
type is a category of task, difficulty is either 1, 2, 3, 4, or 5, completed_count is 0, and date is ${date}. The type options are:
Active, Fun, Normal, Duo, and Rejection Therapy. For each type of task, please provide a task for every difficulty level.
The task should not take more than 60 minutes, but should require the person to leave their house. The tasks should be non specific in the sense that anyone should be able to complete it.
Take into consideration that most places are not within walking distance for many people. Do not tell people how to reach a destination, just tell them to go to where the task will take place.`;
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
  });
};

export default seedTasks;
