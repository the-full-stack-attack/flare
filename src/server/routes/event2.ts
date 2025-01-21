import { Router, Request, Response } from 'express';
const { Event } = require('../db/models/index.ts');

const event2Router = Router();

// type EventData = {
//   id: number;
//   title: string;
//   start_time: Date;
//   end_time: Date;
//   address: string;
//   description: string;
//   venue_id: number;
//   created_by: number;
//   chatroom_id: number;
//   createdAt: Date;
//   updatedAt: Date;
// };

/*
  GET /event => Retrieve all events from the database (filter for events near user in future)
*/
event2Router.get('/', (req: Request, res: Response) => {
  // Query DB for all event objects
  Event.findAll()
    // Success: set Status: 200 & send the array of event objects
    .then((events: object[]) => {
      res.status(200);
      res.send(events);
    })
    // Failure: Log error & send Status: 500
    .catch((err: Error) => {
      console.error('Failed to GET /events:', err);
      res.sendStatus(500);
    });
});

module.exports = {
  event2Router,
};
