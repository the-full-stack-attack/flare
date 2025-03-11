import { Router, Request, Response } from 'express';
import User from '../db/models/users';
import Interest from '../db/models/interests';
import { Model } from 'sequelize';
import User_Interest from '../db/models/users_interests';
import User_Avatar from '../db/models/users_avatars';

const settingsRouter = Router();


type InterestModel = Model & {
    id: number;
    name: string;
};

type UserModel = Model & {
    id: number;
    Interests?: InterestModel[];
};


settingsRouter.put('/user/:userId', async (req, res) => {
    try {
        const { interests, avatar, avatar_uri, ...updateData } = req.body;
        const userId = req.params.userId;

        // update users info in db with req.body data
        await User.update({
            ...updateData,
            avatar_uri, 
        }, {
            where: { id: userId }
        });

        // if avatar data is provided, update User_Avatar
        if (avatar) {
            await User_Avatar.update({
                skin: avatar.skin,
                hair: avatar.hair,
                hair_color: avatar.hair_color,
                eyebrows: avatar.eyebrows,
                eyes: avatar.eyes,
                mouth: avatar.mouth,
            }, {
                where: { UserId: userId }
            });
        }

        // handle interests update 
        if (interests?.length > 0) {
            await User_Interest.destroy({
                where: { UserId: userId }
            });

            const interestRecords = await Interest.findAll({
                where: { name: interests }
            }) as InterestModel[];

            const userInterests = interestRecords.map(interest => ({
                user_id: userId,
                interest_id: interest.id,
                UserId: userId,
                InterestId: interest.id
            }));

            await User_Interest.bulkCreate(userInterests);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating User settings', error);
        res.sendStatus(500);
    }
});



// get user interests from userId
settingsRouter.get('/user/:userId/interests', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, { 
            include: [{
                model: Interest,
                through: { attributes: [] }
            }]
        }) as UserModel;

        const interests = user?.Interests || [];
        res.json(interests);
    } catch (error) {
        console.error('Error getting user interests', error);
        res.sendStatus(500);
    }
})

// avatar route
settingsRouter.get('/user/:userId/avatar', async (req, res) => {
  try {
    const avatarData = await User_Avatar.findOne({
      where: {
        UserId: req.params.userId
      }
    });
    res.json(avatarData);
  } catch (err) {
    console.error('Error getting user avatar data:', err);
    res.sendStatus(500);
  }
});

export default settingsRouter;