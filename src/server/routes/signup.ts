import { Router } from 'express';
import models from '../db/models/index';
const { User, Interest } = models;
const signUpRouter = Router();

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
      const interestNames = allInterests.map((interest: any) => {
        return interest.dataValues.name;
      })
      console.log(interestNames)
      res.send(interestNames).status(200);
    })
    .catch((err: Error) => {
      console.error(err, 'error grabbing interests in routes/signup');
      res.sendStatus(500);
    });
});

export default signUpRouter;
