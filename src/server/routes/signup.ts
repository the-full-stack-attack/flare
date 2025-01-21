// const { Router } = require('express');
import { Router } from 'express';
import { User, Interest } from '../db/models/index';
const signUpRouter = Router();
import Sequelize from 'sequelize';
// const { User, Interest } = require('../db/models/index.ts');

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
      res.sendStatus(201);
      console.log(newUser);
    })
    .catch((err: Error) => {
      console.error(err, 'error on creating the user');
    });
  res.sendStatus(201);
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

export default signUpRouter;
