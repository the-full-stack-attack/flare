const { Router } = require('express');
const signUpRouter = Router();
const { User, Interest } = require('../db/models/index.ts');
const Sequelize = require('sequelize');

signUpRouter.post('/', (req: any, res: any) => {
  const { userName, phone, selectedInterests, full_Name } = req.body;

  console.log(`post req to '/' received by signup`);
  // console.log(req)

  User.create({
    username: userName,
    full_name: full_Name,
    phone_number: phone,
  })
    .then((newUser: any) => {
      console.log(newUser);
      res.sendStatus(201);
    })
    .catch((err: Error) => {
      console.error(err, 'error on creating the user');
    });
});

signUpRouter.get('/interests', (req: any, res: any) => {
  console.log('get req to signup/interests received');
  Interest.findAll()
    .then((allInterests: any) => {
      console.log(allInterests, 'these are all the interests found');
      res.send(allInterests).status(200);
    })
    .catch((err: Error) => {
      console.error(err, 'error grabbing interests in routes/signup');
      res.sendStatus(500);
    });
});

module.exports = {
  signUpRouter,
};
