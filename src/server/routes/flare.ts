import { Router, Request, Response } from 'express';
import User_Flare from '../db/models/users_flares';
import Flare from '../db/models/flares';

const flareRouter = Router();

// GET req to /api/flare/completed/tasks/:id
flareRouter.get('/completed/tasks/:id', (req: any, res: Response) => {
  const { id } = req.params;
  // if yes => Use it to query the database for those User_Flares
  User_Flare.findAll({ where: { UserId: id }, include: [Flare] })
    .then((userFlares) => {
      // Make sure userFlares were found for the type
      if (userFlares) {
        // Find the task flares by filtering and mapping to create an array of just the Flare
        const taskFlares = userFlares.filter((userFlare) => {
          return userFlare.dataValues.Flare.dataValues.type === 'Task Flare'
        }).map((userFlare) => {
          return userFlare.dataValues.Flare;
        })
        res.status(200).send(taskFlares);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error("Error GEtting user's flares: ", err);
    });
});

export default flareRouter;
