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
  console.log('received')
  console.log(req.query);
  const { eventId, user, userId } = req.query;
  console.log(eventId, user, userId, 'extracted from query')
  Chatroom.findOrCreate({ where: { event_id: eventId}})
  .then((value) => {
    console.log(value, 'chatroom returned');
    const { id } = value[0].dataValues;
    Chat.findAll({where: { chatroom_id: id }})
    .then((mixChats) => {
      console.log(mixChats, 'success w/ mixChats')
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
  console.log('received')
  console.log(req.body);
  const { eventId, user, userId, recording } = req.body.body;
 console.log(eventId, user, userId, recording, 'extracted from body')

   Chatroom.findOrCreate({ where: { event_id: eventId}})
   .then((value) => {
     console.log(value, 'chatroom returned');
     const { id } = value[0].dataValues;
     Chat.findOrCreate({ 
      where: { chatroom_id: id, user_id: userId },
      defaults: {
        chatroom_id: id,
        user_id: userId,
        macro: recording
      }
    }).then((newChat) => {
      newChat[0].update({ macro: recording})
      .then((updated) => {
        console.log('successful chat UPDATED --->v', updated)
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
  // console.log(req.user)
  // console.log( userId, ' should be a users id ');
 User.findOne({ where: { username: req.user.username } })
 .then((userObj: any) => {
  // console.log(userObj.avatar_uri, ' found avatar')
})
  res.send('aye').status(200);
})
export default chatroomRouter;

// chatroomRouter.post('/chatroom/chat', (req, res) => {
//   const { eventId, username, msg } = req.body
//   // get the table based on the incoming chatroom_id OR event_id
//   Chatroom.findOne({
//     where: 
//   })
//   // Create a [table: chats] that is linked with [table: chatroom] via row chatroom_id

//   // send back nothing

// });