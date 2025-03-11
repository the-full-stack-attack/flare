import Router from 'express';
import Interest from '../db/models/interests';
import User_Interest from '../db/models/users_interests';
import User from '../db/models/users';
import Sequelize from 'sequelize';
import User_Avatar from '../db/models/users_avatars';
const signUpRouter = Router();

signUpRouter.post('/', (req: any, res: any) => {
  const { userName, phone, selectedInterests, full_Name, avatarItems, avatarUri, } = req.body;

  // Update the user who just signed up
  User.update(
    {
      username: userName,
      full_name: full_Name,
      phone_number: phone || null,
      avatar_uri: avatarUri,
    },
    {
      where: {
        google_id: req.user.google_id,
      },
    }
  )
   .then(() => {
      User.findOne({
        where: { google_id: req.user.google_id },
      })
      .then(async (newUser) => {
          // console.log(newUser?.dataValues.id, 'a number hopefully');
          // Initialize a variable to hold the interest that
          // matches the users selected interest at each index
          for (let i = 0; i < selectedInterests.length; i++) {
            try {
              const interest = await Interest.findAll({
                where: {
                  name: selectedInterests[i],
                },
              });
              console.log(interest[0].dataValues.id, 'a number');
              await User_Interest.create({
                user_id: newUser?.dataValues.id,
                interest_id: interest[0].dataValues.id,
                UserId: newUser?.dataValues.id,
                InterestId: interest[0].dataValues.id,
              })
              // Define that interest is related to the new user
              // if(newUser !== null){
              //  await newUser.addInterest(interest, {
              //    through: { name: selectedInterests[i] },
              //  });
                console.log(selectedInterests[i], 'interest added');
              // }

                await User_Avatar.create({
                    skin: avatarItems.skinColor[0],
                    hair: avatarItems.hair[0],
                    hair_color: avatarItems.hairColor[0],
                    eyebrows: avatarItems.eyebrows[0],
                    eyes: avatarItems.eyes[0],
                    mouth: avatarItems.mouth[0],
                    UserId: newUser?.dataValues.id,
                })


            } catch (err: any) {
              console.error(err, 'failed to connect interest to the user');
            }
          }
          res.sendStatus(201);
        })
        .catch((err: Error) => {
          console.error(err, 'error on creating the user');
        });
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

// route to get user avatar data
signUpRouter.get('/user/:id/avatar', (req: any, res: any) => {
  User_Avatar.findOne({
    where: {
      UserId: req.params.id
    }
  })
    .then((avatarData) => {
      res.send(avatarData).status(200);
    })
    .catch((err: Error) => {
      console.error(err, 'error getting user avatar data');
      res.sendStatus(500);
    });
});

export default signUpRouter;
