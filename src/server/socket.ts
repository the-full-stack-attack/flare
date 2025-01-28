import { Server, Socket } from 'socket.io';
import Player from '../client/assets/chatroom/chatAssets'

const initializeSocket = (
  server: any,
  PLAYER_LIST: any,
  SOCKET_LIST: any
) => {
  const io = new Server(server);
  // Register event listeners for Socket.IO
  io.on('connection', (socket) => {
    // when client joins chat, create a player, add them to the lists
    socket.on('joinChat', ({ user, eventId }) => {
      console.log( typeof eventId, eventId)
      socket.data.name = socket.id;
      socket.data.eventId = eventId;
      socket.join(eventId);
      const stringName = socket.data.name;
      SOCKET_LIST[stringName] = socket;
      const player = Player(socket.id, user, eventId);
      PLAYER_LIST[socket.id] = player;
    });
    // On disconnect, delete them from the lists
    socket.on('disconnect', () => {
      socket.leave(socket.data.eventId);
      delete SOCKET_LIST[socket.id];
      delete PLAYER_LIST[socket.id];
    });

    // Controls movement. Update their respective state via socket.id
    socket.on('keyPress', ({ inputId, state }) => {
      if (inputId === 'Up') {
        PLAYER_LIST[socket.id].pressingUp = state;
      }
      if (inputId === 'Left') {
        PLAYER_LIST[socket.id].pressingLeft = state;
      }
      if (inputId === 'Right') {
        PLAYER_LIST[socket.id].pressingRight = state;
      }
      if (inputId === 'Down') {
        PLAYER_LIST[socket.id].pressingDown = state;
      }
    });

    socket.on('message', ({ message, eventId }) => {
      console.log(eventId, 'message id')
      console.log( message, 'the message')
      PLAYER_LIST[socket.id].sentMessage = true;
      PLAYER_LIST[socket.id].currentMessage = message;
      socket.to(eventId).emit('message', message);
      // Remove message after a few seconds
      setTimeout(() => {
        PLAYER_LIST[socket.id].sentMessage = false;
      }, 2000);
    });
  });
};

export default initializeSocket;
