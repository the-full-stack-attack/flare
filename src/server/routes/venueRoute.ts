import { Router } from 'express';
import Venue_Tag from '../db/models/venue_tags';

const venueRouter = Router();

venueRouter.get('/tags/:id', async (req: any, res: any) => {
    try {
        const tags = await Venue_Tag.findAll({
            where: {
                venue_id: req.params.id
            }
        });
        res.status(200).send(tags);
    } catch (error) {
        console.error('Error getting venue tags:', error);
        res.sendStatus(500);
    }
});

export default venueRouter;