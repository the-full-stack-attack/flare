const dotenv = require('dotenv');

const { GoogleGenerativeAI } = require('@google/generative-ai');
// import GoogleGenerativeAI from 'google/generative-ai'
dotenv.config();
const { GEMINI_KEY } = process.env;
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const makeDates = () => {
  const today = new Date();
  // eslint-disable-next-line prettier/prettier
  const prompt = `With the first date being ${today}, please provide a JSON array of dates of 3 consecutive dates. Put the dates in MM/DD/YY format.`;
  return model
    .generateContent(prompt)
    .then((result) => {
      const dates = result.response.text().split('\n').slice(2, 5);
      console.log('Dates: ', dates);
      console.log('Dates: ', Array.isArray(dates));
      return dates;
    })
    .catch((err) => {
      console.error('Error generating dates: ', err);
    });
};

const seedTasks = async () => {
  const dates = await makeDates();
  console.log('Dates in seed: ', dates);
  dates.forEach((date) => {
    console.log('For each called');
    const prompt = `I am seeding a MySQL database and need the tasks formatted as JSON objects. The objects should have the following properties: Description is a task for the user to do in order to get out of the house,
type is a category of task, difficulty_rating is a number between 1 and 5, completed_count is any positive whole number, and date is ${date}. The type options are:
Active, Fun, Normal, Duo, and Rejection Therapy. Give me 5 tasks for each category for the provided date, one for each difficulty level.
The task should not take more than 60 minutes, but should require the person to leave their house. The tasks should be non specific in the sense that anyone should be able to complete it.
Take into consideration that most places may not be walking distance for a lot of people. Do not tell people how to reach a destination, just tell them to go to where the
task will take place. Also include any grammatical errors I made in this prompt in a note separate from the tasks, and tell me how many tasks were generated.`;
    model
      .generateContent(prompt)
      .then((result) => {
        const tasksArr = result.response.text();
        console.log(tasksArr);
        // console.log('Response from Gemini: ', result.response.text());
      })
      .catch((err) => {
        console.error('Error from gemini: ', err);
      });
  });
};

seedTasks();
