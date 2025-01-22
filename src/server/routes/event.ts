const { Router } = require('express');
const { Event } = require('../db/models/index.ts');
const eventRouter = Router();
// Coltron

eventRouter.post('/', async (req: unknown, res: unknown ) => {
  // const { username, fullName, phone, title, address, selectedInterests, category, startDate, endDate, } = req.body;
  // console.log('Post req to / received by eventRouter');
  // try {
  //   const newEvent = await Event.create({
  //     title: title,
  //     start_time: startDate,
  //     end_time: endDate,
  //     address: address,
  //     description: description,
  //     username: username,
  //     full_name: fullName,
  //     phone_number: phone,
  //     interests: selectedInterests,
  //     category: category,
  //     start_time: startDate,
  //     end_time: endDate,
  //   })
  // } catch (error) {
  //
  // }
})

module.exports = {
  eventRouter,
};
