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

  setInterval(() => {
    let pack = []; // package to store players
    for (let key in PLAYER_LIST) {
      let player = PLAYER_LIST[key];
      player.updatePosition();
      pack.push({
        id: player.name,
        x: player.data.x,
        y: player.data.y,
        username: player.username,
        sentMessage: player.sentMessage,
        currentMessage: player.currentMessage,
        room: player.eventId,
      });
    }
    // loop through the sockets and send the package to each of them
    for (let key in SOCKET_LIST) {
      let socket = SOCKET_LIST[key];
      socket.emit('newPositions', pack);
    }
  }, 1000 / 25);
};

export default initializeSocket;
