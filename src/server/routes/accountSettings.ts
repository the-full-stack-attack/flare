import { Router, Request, Response } from 'express';
import User from '../db/models/users';
import Interest from '../db/models/interests';
import { Model } from 'sequelize';
import User_Interest from '../db/models/users_interests';
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
    // console.log('route hit');
    try {
        // console.log('need to update: ', req.body);
        const { interests, ...updateData } = req.body;
        const userId = req.params.userId;


        // update users info in db with req.body data
        await User.update(updateData, {
            where: { id: userId }
        });

        // if user changed selected interests
        if (interests.length > 0) {
            // destroy existing selected interests for User in User_Interest to avoid trying to add the same interest twice
            await User_Interest.destroy({
                where: { UserId: userId }
            });

            // find matching interests
            const interestRecords = await Interest.findAll({
                where: { name: interests }
            }) as InterestModel[];

            // set up new associations
            const userInterests = interestRecords.map(interest => ({
                user_id: userId, // remove redundancies in future polishing...
                interest_id: interest.id,
                UserId: userId,
                InterestId: interest.id
            }));

            // create new interests for user
            await User_Interest.bulkCreate(userInterests);
            res.sendStatus(200);
        }
    } catch (error) {
        console.error('Error updating User settings', error);
        res.sendStatus(500);
    }
});



// get user interests from userId
settingsRouter.get('/user/:userId/interests', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, { // search by primary key
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

export default settingsRouter;