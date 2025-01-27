/* eslint-disable no-param-reassign */
import https from 'https';
import http from 'http';
import fs from 'fs';
import { Server, Socket as OriginalSocket } from 'socket.io';
import app from './app';
import database from './db/index';
import './db/models/index';
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

const SOCKET_LIST: SocketList = {};
const PLAYER_LIST: PlayerList = {};

// Creates a player object with their own state... (replace with keyword 'this'?)
const Player = function (id: any, user: any) {
  console.log(user.username)
  const self = {
    username: user.username,
    name: id,
    data: {
      // positions
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
    updatePosition() {
      // method for updating state of movement
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
    },
  };
  return self;
};

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
          socket.on('joinChat', (user) => {
            console.log('join chat', user)
            socket.data.name = socket.id;
            const stringName = socket.data.name;
            SOCKET_LIST[stringName] = socket;
            const player = Player(socket.id, user);
            PLAYER_LIST[socket.id] = player;
          });
          // On disconnect, delete them from the lists
          socket.on('disconnect', () => {
            console.log('user disconnected');
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

  // IF NOT USING SOCKETS

  if (process.env.SOCKET !== 'true') {

    // START SERVER AS NORMAL
    
    https.createServer(options, app).listen(443);


  } else { // OTHERWISE

    // START THE SERVER WITH SOCKETS

    const io = new Server(https.createServer(options, app));
    // SOCKET ROUTING
    io.on('connection', (socket) => {
      console.log('a user connected', socket.id);
      // when client joins chat, create a player, add them to the lists
      socket.on('joinChat', (user) => {
        console.log('join chat', user)
        socket.data.name = socket.id;
        const stringName = socket.data.name;
        SOCKET_LIST[stringName] = socket;
        const player = Player(socket.id, user);
        PLAYER_LIST[socket.id] = player;
      });
      // On disconnect, delete them from the lists
      socket.on('disconnect', () => {
        console.log('user disconnected');
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

    https.createServer(options, app).listen(443);
  }
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
      username: player.username,
      sentMessage: player.sentMessage,
      currentMessage: player.currentMessage,
    });
  }
  // loop through the sockets and send the package to each of them
  for (let key in SOCKET_LIST) {
    let socket = SOCKET_LIST[key];
    socket.emit('newPositions', pack);
  }
}, 1000 / 25);
