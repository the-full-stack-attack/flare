import { Router, Request, Response } from 'express';
import User from '../db/models/users';
import sequelize from 'sequelize';

const settingsRouter = Router();

settingsRouter.put('/user/:userId', async (req, res) => {
    console.log('route hit');
    try {
        console.log('need to update: ', req.body);
        const updateData = req.body;

        console.log(updateData);
        const result = await User.update(updateData, {
            where: {id: req.params.userId}
        });

        const updatedUser = await User.findByPk(req.params.userId);
        console.log('user after update', updatedUser?.toJSON());


        res.json(result);
    } catch (error) {
        console.error('Error updating User settings', error);
        res.sendStatus(500);
    }
})

export default settingsRouter;