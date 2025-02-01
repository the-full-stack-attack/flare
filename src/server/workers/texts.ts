import cron from 'node-cron';
import dayjs from 'dayjs';

import Text from '../db/models/texts';
import User from '../db/models/users';

cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * *', () => {
  // console.log('Every 5 minutes', dayjs(Date.now()).format('H:mm:ss A'));
});
