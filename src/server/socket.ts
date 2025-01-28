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
    socket.on('joinChat', (user) => {
      socket.data.name = socket.id;
      const stringName = socket.data.name;
      SOCKET_LIST[stringName] = socket;
      const player = Player(socket.id, user);
      PLAYER_LIST[socket.id] = player;
    });
    // On disconnect, delete them from the lists
    socket.on('disconnect', () => {
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

    socket.on('message', (msg) => {
      PLAYER_LIST[socket.id].sentMessage = true;
      PLAYER_LIST[socket.id].currentMessage = msg;
      socket.broadcast.emit('message', msg);
      // Remove message after a few seconds
      setTimeout(() => {
        PLAYER_LIST[socket.id].sentMessage = false;
      }, 2000);
    });
  });
};

export default initializeSocket;
