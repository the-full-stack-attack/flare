import { Router, Request, Response } from 'express';
import { getImageUrl } from '../helpers/flares';
import User_Flare from '../db/models/users_flares';
import Flare from '../db/models/flares';

const flareRouter = Router();
// GET requests to /api/flare/:id (id is the user id)
flareRouter.get('/:id', async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const userFlares = await User_Flare.findAll({
      where: { UserId: id },
      include: [Flare],
    });
    const flares = userFlares.map((userFlare) => {
      return userFlare.dataValues.Flare;
    });
    for (let i = 0; i < flares.length; i++) {
      const flare = flares[i];
      const imageKey = flare.dataValues.icon;
      console.log('Image key: ', imageKey);
      const imageUrl: string = await getImageUrl(imageKey);
      console.log('image url: ', imageUrl);
      flare.dataValues.icon = imageUrl;
      console.log('Changed flare: ', flare);
      }
    res.status(200).send(flares);
  } catch (err) {
    console.error('Error in GET to /api/flare/:id: ', err);
    res.sendStatus(500);
  }
});

// GET req to /api/flare/completed/tasks/:id
flareRouter.get('/completed/tasks/:id', (req: any, res: Response) => {
  const { id } = req.params;
  // if yes => Use it to query the database for those User_Flares
  User_Flare.findAll({ where: { UserId: id }, include: [Flare] })
    .then((userFlares) => {
      // Make sure userFlares were found for the type
      if (userFlares) {
        // Find the task flares by filtering and mapping to create an array of just the Flare
        const taskFlares = userFlares
          .filter((userFlare) => {
            return userFlare.dataValues.Flare.dataValues.type === 'Task Flare';
          })
          .map((userFlare) => {
            return userFlare.dataValues.Flare;
          });
        res.status(200).send(taskFlares);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error("Error GEtting user's flares: ", err);
      res.sendStatus(500);
    });
});

export default flareRouter;
