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

/*
  GET /api/text/:event_id => Retrieve an id using UserId & EventId
*/
textRouter.get('/:eventId', (req: any, res: Response) => {
  Text.findOne({
    where: {
      user_id: req.user.id,
      event_id: req.params.eventId,
    },
  })
    .then((text) => {
      res.status(200).send(text);
    })
    .catch((err: unknown) => {
      console.error('Failed to GET /api/text/:eventId', err);
      res.sendStatus(500);
    });
});

/*
  PATCH /api/text/:eventId
  BODY: { text: { content, time_from_start, send_time } }
*/
textRouter.patch('/:eventId', (req: any, res: Response) => {
  const { text } = req.body;
  Text.update(text, {
    where: { user_id: req.user.id, event_id: req.params.eventId },
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: unknown) => {
      console.error('Failed to PATCH /api/text/update/:eventId', err);
      res.sendStatus(500);
    });
});

/*
  DELETE /api/text/:id => Delete text from DB so the worker doesn't send it.
*/
textRouter.delete('/:eventId', (req: any, res: Response) => {
  Text.destroy({
    where: {
      user_id: req.user.id,
      event_id: req.params.eventId,
    },
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: unknown) => {
      console.error('Failed to DELETE /api/text/:eventId', err);
      res.sendStatus(500);
    });
});

export default textRouter;
