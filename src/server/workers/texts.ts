import cron from 'node-cron';
import dayjs from 'dayjs';
import axios from 'axios';
import dotenv from 'dotenv';
import { Op } from 'sequelize';

import Text from '../db/models/texts';
import User from '../db/models/users';

dotenv.config();

const { TEXTBELT_API_KEY } = process.env;

cron.schedule('*/5 * * * *', () => {
  // console.log('Every 5 minutes', dayjs(Date.now()).format('H:mm:ss A'));
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
          .then((user: any) => {
            // Send text using user phone number
            axios
              .post('https://textbelt.com/text', {
                phone: user.dataValues.phone_number,
                message: text.dataValues.content,
                key: TEXTBELT_API_KEY,
              })
              .then(({ data }) => {
                // data: { success: boolean, textId: string, quotaRemaining: number }
                if (data.success) {
                  // Destroy text once the text sends
                  text.destroy();
                }
              })
              .catch((err: unknown) => {
                console.error('Failed to send text:', err);
              });
          })
          .catch((err: unknown) => {
            console.error('Failed to find User to text:', err);
          });
      });
    })
    .catch((err: unknown) => {
      console.error('Failed to findAll Texts:', err);
    });
});
