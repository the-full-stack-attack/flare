import {Router, Request, Response } from 'express';
import Category from '../db/models/categories';
import User from '../db/models/users';

const eventRouter = Router();
// Coltron


eventRouter.post('/', async (req: Request, res: Response) => {
    try {
        console.log('WTF!');
        res.sendStatus(200);

    } catch (error) {
        console.error('Error adding new event to DB', error);
        res.sendStatus(500);
    }
});

eventRouter.get('/categories', async (req: Request, res: Response) => {
    try {
        const allCategories = await Category.findAll();
        const data = allCategories.map((category) => ({
            name: category.dataValues.name,
            id: category.dataValues.id,
        }));
        res.send(data).status(200);
    } catch (error) {
        console.error('Error getting categories from DB', error);
        res.sendStatus(500);
    }
});


export default eventRouter;
