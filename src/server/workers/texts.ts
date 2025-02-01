import cron from 'node-cron';
import dayjs from 'dayjs';
import axios from 'axios';
import dotenv from 'dotenv';
import { Op } from 'sequelize';

import Text from '../db/models/texts';
import User from '../db/models/users';

dotenv.config();

const { TEXTBELT_API_KEY } = process.env;

// const sendText = () => {
//   fetch('https://textbelt.com/text', {
//     method: 'post',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       phone: '9857058143',
//       message: 'Hello world',
//       key: TEXTBELT_API_KEY,
//     }),
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//     });
// };

// sendText();

// axios
//   .post('https://textbelt.com/text', {
//     phone: '9857058143',
//     message: 'Hello world',
//     key: TEXTBELT_API_KEY,
//   })
//   .then(({ data }) => {
//     console.log(data); // { success: boolean, textId: string, quotaRemaining: number }
//   })
//   .catch((err: unknown) => {
//     console.error('Failed to send text:', err);
//   });

cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * *', () => {
  console.log('Every 5 minutes', dayjs(Date.now()).format('H:mm:ss A'));
  // Query Texts table for all send_times from 10 minutes ago to now
  const now = Date.now();
  Text.findAll({
    where: {
      send_time: {
        [Op.between]: [new Date(now - 1000 * 60 * 10), new Date(now)],
      },
    },
  })
    .then((texts) => {
      // Iterate through texts returned
      texts.forEach((text: any) => {
        // Find the user using user_id
        User.findOne({ where: { id: text.dataValues.user_id } })
          .then((user) => {
            console.log('User:', user);
            console.log('Text:', text);
          })
          .catch((err: unknown) => {
            console.error('Failed to find User to text:', err);
          });
      });
    })
    .catch((err: unknown) => {
      console.error('Failed to findAll Texts:', err);
    });
        // Send text using user phone number
          // Destroy text once the text sends
});
