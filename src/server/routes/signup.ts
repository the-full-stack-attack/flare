const { Router } = require('express');
const signUpRouter = Router();
const { Users } = require('../db/models/index.ts');
const Sequelize = require('sequelize')
// const bodyParser = require('body-parser');

// signUpRouter.use(bodyParser);

  signUpRouter.post('/', (req: any, res: any ) => {
    const { userName, phone, selectedInterests, full_Name } = req.body;

    console.log(`post req to '/' received by signup`)
    // console.log(req)

    Users.create({
      username: userName,
      full_name: full_Name,
      phone_number: phone,
    })
    .then((newUser: any) => {
      console.log(newUser);
    })
    .catch((err: Error) => {
      console.error(err, 'error on creating the user')
    })
    res.sendStatus(201);
  } )

module.exports = {
  signUpRouter
};