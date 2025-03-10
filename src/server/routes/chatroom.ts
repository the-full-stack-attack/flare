import { Router } from 'express';
import Sequelize from 'sequelize';
import Event from '../db/models/events';
import Chatroom from '../db/models/chatrooms';
import User from '../db/models/users';
import Chat from '../db/models/chats';
import { CalendarArrowUp } from 'lucide-react';

const chatroomRouter = Router();

chatroomRouter.get('/chats', (req, res) => {
  // Get the room number based on enpoint params
  const { eventId, user, userId } = req.query;
  Chatroom.findOrCreate({ where: { event_id: eventId}})
  .then((value) => {
    const { id } = value[0].dataValues;
    Chat.findAll({where: { chatroom_id: id }})
    .then((mixChats) => {
      res.send(mixChats).status(200);
    }).catch((error) => {
      res.sendStatus(404);
    })
  }).catch((error) => {
    console.error('fatal request', error);
    res.sendStatus(404);
  })
});

chatroomRouter.post('/chats', (req, res) => {
  // Get the room number based on enpoint params
  const { eventId, user, userId, recording } = req.body.body;

   Chatroom.findOrCreate({ where: { event_id: eventId}})
   .then((value) => {
     const { id } = value[0].dataValues;
     Chat.findOrCreate({ 
      where: { chatroom_id: id, user_id: userId },
      defaults: {
        chatroom_id: id,
        user_id: userId,
        macro: recording,
        username: user,
      }
    }).then((newChat) => {
      newChat[0].update({ macro: recording, username: user})
      .then((updated) => {
        res.sendStatus(201);
      }).catch((error) => {
        console.error('failed to update chat', error);
        res.sendStatus(404);
      })
    }).catch((error) => {
      console.error('failed to find or create chat', error);
      res.sendStatus(404);
    })
   }).catch((error) => {
     console.error('fatal request', error);
     res.sendStatus(404);
   })

});

chatroomRouter.get('/image', (req: any, res) => {
  const userId = req.user.id;
 User.findOne({ where: { username: req.user.username } })
 .then((userObj: any) => {
})
  res.send('aye').status(200);
})
export default chatroomRouter;
