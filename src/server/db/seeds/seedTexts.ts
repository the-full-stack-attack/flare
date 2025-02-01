import database from '../index';
import Text from '../models/texts';

const seedTexts = async () => {
  try {
    await Text.destroy({ where: { user_id: 2 } });

    await Text.create({
      content: 'Should not show up',
      time_from_start: '30-minutes',
      user_id: 2,
      send_time: new Date(Date.now() - 1000 * 60 * 15),
      event_id: 16,
    });
    await Text.create({
      content: 'Might show up',
      time_from_start: '30-minutes',
      user_id: 2,
      send_time: new Date(Date.now() - 1000 * 60 * 10),
      event_id: 16,
    });
    await Text.create({
      content: 'Should def show up',
      time_from_start: '30-minutes',
      user_id: 2,
      send_time: new Date(Date.now() - 1000 * 60 * 5),
      event_id: 16,
    });
    await Text.create({
      content: 'This is now.',
      time_from_start: '30-minutes',
      user_id: 2,
      send_time: new Date(Date.now() - 1000 * 60 * 0),
      event_id: 16,
    });
    await Text.create({
      content: 'This is in the future and might show up.',
      time_from_start: '30-minutes',
      user_id: 2,
      send_time: new Date(Date.now() + 1000 * 60 * 5),
      event_id: 16,
    });
    await Text.create({
      content: 'Def should not show up',
      time_from_start: '30-minutes',
      user_id: 2,
      send_time: new Date(Date.now() + 1000 * 60 * 10),
      event_id: 16,
    });
    console.log('Texts seeded.');
  } catch (err: unknown) {
    console.error('Failed to seedTexts:', err);
  }
};

seedTexts();
