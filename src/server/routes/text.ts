import { Router, Response } from 'express';

import Text from '../db/models/texts';

const textRouter = Router();

/*
  POST /api/text => Create a text to be sent later for the user
*/
textRouter.post('/', (req: any, res: Response) => {
  const { content, send_time, event_id } = req.body;
  const user_id = req.user.id;
  Text.create({ content, user_id, send_time, event_id })
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
