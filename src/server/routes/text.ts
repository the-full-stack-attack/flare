import { Router, Response } from 'express';

import Text from '../db/models/texts';

const textRouter = Router();

/*
  POST /api/text => Create a text to be sent later for the user
*/
textRouter.post('/', (req: any, res: Response) => {
  const { text } = req.body;
  text.user_id = req.user.id;
  Text.findOrCreate({
    where: { user_id: req.user.id, event_id: text.event_id },
    defaults: text,
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: unknown) => {
      console.error('Failed to POST /api/text', err);
      res.sendStatus(500);
    });
});

/* ???
  GET /api/text/:id => Retrieve an id using UserId & EventId
*/

/*
  PATCH /api/text/:id
*/

/*
  DELETE /api/text/:id => Delete text from DB so the worker doesn't send it.
*/

export default textRouter;
