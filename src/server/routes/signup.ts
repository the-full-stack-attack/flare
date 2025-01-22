import Router from 'express';
import Interest from '../db/models/interests';
import User_Interest from '../db/models/users_interests';
import User from '../db/models/users';
import Sequelize from 'sequelize';

const signUpRouter = Router();

signUpRouter.post('/', (req: any, res: any) => {
  const { userName, phone, selectedInterests, full_Name } = req.body;

  // Create the user who just signed up
  User.create({
    username: userName,
    full_name: full_Name,
    phone_number: phone,
  })
    .then(async (newUser: any) => {
      // Initialize a variable to hold the interest that
      // matches the users selected interest at each index
      for (let i = 0; i < selectedInterests.length; i++) {
        try {
          const interest = await Interest.findAll({
            where: {
              name: selectedInterests[i],
            },
          });
          // Define that interest is related to the new user
          await newUser.addInterest(interest, {
            through: { name: selectedInterests[i] },
          });
          console.log(selectedInterests[i], 'interest added');
        } catch (err: any) {
          console.error(err, 'failed to connect interest to the user');
        }
      }
      res.sendStatus(201);
    })
    .catch((err: Error) => {
      console.error(err, 'error on creating the user');
    });
});

//  Gets all interests tables
signUpRouter.get('/interests', (req: any, res: any) => {
  Interest.findAll()
    .then((allInterests: any) => {
      const interestNames = allInterests.map(
        (interest: any) => interest.dataValues.name
      );
      res.send(interestNames).status(200);
    })
    .catch((err: Error) => {
      console.error(err, 'error grabbing interests in routes/signup');
      res.sendStatus(500);
    });
});

export default signUpRouter;
