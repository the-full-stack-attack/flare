const { Router } = require('express');
const { Users } = require('../db/models/index.ts');

const signUpRouter = Router();
// const bodyParser = require('body-parser');

// signUpRouter.use(bodyParser);

signUpRouter.post('/', (req: any, res: any ) => {
  const { userName, phone, selectedInterests, fullName } = req.body;
  console.log('post req to / received by signup');
  Users.create({
    username: userName,
    full_name: fullName,
    phone_number: phone,
  })
    .then((newUser: any) => {
      res.sendStatus(201);
      console.log(newUser);
    })
    .catch((err: Error) => {
      console.error(err, 'error on creating the user');
      res.sendStatus(500);
    });
});

module.exports = {
  signUpRouter,
};
