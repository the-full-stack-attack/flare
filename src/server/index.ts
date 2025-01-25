import https from 'https';
import http from 'http';
import fs from 'fs';
import { Server, Socket as OriginalSocket } from 'socket.io';
import app from './app';
import database from './db/index';
import { data } from 'react-router';

import('./db/index');

const PORT = 4000;

// Lists of Sockets and Players, key will be socket.id
interface SocketList {
  [key: string]: any;
}
interface PlayerList {
  [key: string]: any;
}

let SOCKET_LIST: SocketList = {};
let PLAYER_LIST: PlayerList = {};

// Creates a player object with their own state... (replace with keyword 'this'?)
const Player = function (id: any) {
  let self = {
    name: id,
    data: { // positions
      x: 25,
      y: 25,
    },
    number: Math.floor(10 * Math.random()), 
    pressingRight: false, // states of movement
    pressingLeft: false,
    pressingUp: false,
    pressingDown: false,
    maxSpd: 10,
    sentMessage: false,
    currentMessage: '',
    updatePosition() { // method for updating state of movement
      if (self.pressingRight) {
        self.data.x += self.maxSpd;
      }
      if (self.pressingLeft) {
        self.data.x -= self.maxSpd;
      }
      if (self.pressingUp) {
        self.data.y -= self.maxSpd;
      }
      if (self.pressingDown) {
        self.data.y += self.maxSpd;
      }
    }
  }
  return self;
}

if (process.env.DEVELOPMENT === 'true') {
  database
    .sync({ alter: true })
    .then(() => {
      if (process.env.SOCKET !== 'true') { 
        app.listen(PORT, '0.0.0.0', () => {
          console.log(`Listening on http://localhost:${PORT}`);
        });
      } else {
        const server = http.createServer(app);
        const io = new Server(server);
        // Register event listeners for Socket.IO
        io.on('connection', (socket) => {
          console.log('a user connected', socket.id);

          // when client joins chat, create a player, add them to the lists
          socket.on('joinChat', () => {
            socket.data.name = socket.id;
            let stringName = socket.data.name;
            SOCKET_LIST[stringName] = socket;
            let player = Player(socket.id);
            PLAYER_LIST[socket.id] = player;
          });
          // On disconnect, delete them from the lists
          socket.on('disconnect', () => {
            console.log('user disconnected');
            delete SOCKET_LIST[socket.id];
            delete PLAYER_LIST[socket.id];
          });

          // Controls movement. Update their respective state via socket.id
          socket.on('keyPress', (data) => {
            console.log(data)
            if (data.inputId === 'Up') {
              PLAYER_LIST[socket.id].pressingUp = data.state
            }
            if (data.inputId === 'Left') {
              PLAYER_LIST[socket.id].pressingLeft = data.state
            }
            if (data.inputId === 'Right') {
              PLAYER_LIST[socket.id].pressingRight = data.state
            }
            if (data.inputId === 'Down') {
              PLAYER_LIST[socket.id].pressingDown = data.state
            }
          });

          socket.on('message', (msg) => {
            console.log('message: ' + msg);
            PLAYER_LIST[socket.id].sentMessage = true;
            PLAYER_LIST[socket.id].currentMessage = msg;
            socket.broadcast.emit('message', msg);
            setTimeout(() => {
              PLAYER_LIST[socket.id].sentMessage = false;
            }, 2000)
          });
        });

        server.listen(4000, () => {
          console.log('listening on *:4000');
        });
      }
    })
    .catch((err: Error) => {
      console.error(err, 'oops!');
    });
} else {
  const options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/slayer.events/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/slayer.events/privkey.pem'),
  };

  const io = new Server(https.createServer(options, app));
  io.on('connection', (socket) => {
    socket.emit('connect', { message: 'a new client connected!' });
  });

  https.createServer(options, app).listen(443);
}

// Async function, updates chatroom state based on all player positions in list
setInterval(() => {
  let pack = []; // package to store players
  for (let key in PLAYER_LIST) {
    let player = PLAYER_LIST[key];
    player.updatePosition();
    pack.push({
      id: player.name,
      x: player.data.x,
      y: player.data.y,
      sentMessage: player.sentMessage,
      currentMessage: player.currentMessage
    });
  }
  // loop through the sockets and send the package to each of them
  for (let key in SOCKET_LIST) { 
    let socket = SOCKET_LIST[key];
    socket.emit('newPositions', pack);
  }
}, 1000 / 25);
