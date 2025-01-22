import {Router} from 'express';
import Category from '../db/models/categories';
import User from '../db/models/users';

const eventRouter = Router();
// Coltron


eventRouter.post('/', async (req: unknown, res: unknown) => {
    // const { username, fullName, phone, title, address, selectedInterests, category, startDate, endDate, } = req.body;
    // console.log('Post req to / received by eventRouter');
    // try {
    //   const newEvent = await Event.create({
    //     title: title,
    //     start_time: startDate,
    //     end_time: endDate,
    //     address: address,
    //     description: description,
    //     username: username,
    //     full_name: fullName,
    //     phone_number: phone,
    //     interests: selectedInterests,
    //     category: category,
    //     start_time: startDate,
    //     end_time: endDate,
    //   })
    // } catch (error) {
    //
    // }
});

eventRouter.get('/categories', async (req: any, res: any) => {
    try {
        const allCategories = await Category.findAll();
        const data = allCategories.map((category) => ({
            name: category.dataValues.name,
            id: category.dataValues.id,
        }));
        console.log(data);
        res.send(data).status(200);
    } catch (error) {
        console.error('Error getting categories from DB', error);
        res.sendStatus(500);
    }
});


export default eventRouter;
