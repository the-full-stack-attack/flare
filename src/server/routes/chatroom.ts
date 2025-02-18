import { Router } from 'express';
import Sequelize from 'sequelize';
import Event from '../db/models/events';
import Chatroom from '../db/models/chatrooms';
import User from '../db/models/users';


const chatroomRouter = Router();

chatroomRouter.get('/chatroom/:eventId', (req, res) => {
  // Get the room number based on enpoint params
  const pathname = req.params.eventId

  Chatroom.findOne({
    where: { event_id: pathname },
  }).then((chatroom) => {
    // console.log(chatroom, 'we found it')
    res.send(chatroom).status(200)
  }).catch((err) =>{
    console.error(err, 'nope')
  })
  // the endpoint should match the Event id. get the chatroom_id off that table
  
  // find the chatroom that has the matching id, get the map from that chatroom

  // send the map back to the chatroom, along with the chatroom_id. 

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