const { Router } = require('express');
const { Event } = require('../db/models/index.ts');
const eventRouter = Router();
// Coltron

eventRouter.post('/', async (req: unknown, res: unknown ) => {
  const { username: string, fullName, phone, address, selectedInterests, category, startDate, endDate, } = req.body;
  console.log('Post req to / received by eventRouter');
  try {
    const newEvent = await Event.create({
      username: username,
      full_name: fullName,
      phone_number: phone,
      address: address,
      interests: selectedInterests,
      category: category,
      start_time: startDate,
      end_time: endDate,
    })
  } catch (error) {

  }
})

module.exports = {
  eventRouter,
};
