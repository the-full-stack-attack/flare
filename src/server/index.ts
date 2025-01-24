import https from 'https';
import http from 'http';
import fs from 'fs';
import { Server, Socket as OriginalSocket } from 'socket.io';
import app from './app';
import database from './db/index';
import { data } from 'react-router';

import('./db/index');

// declare module 'socket.io' {
//   interface Socket extends OriginalSocket {
//     name: number;
//     x: number;
//     y: number;
//   }
// }

const PORT = 4000;
interface SocketList {
  [key: string]: any;
}
interface PlayerList {
  [key: string]: any;
}
let SOCKET_LIST: SocketList = {};
let PLAYER_LIST: PlayerList = {};

const Player = function (id: any) {
  let self = {
    name: id,
    data: {
      x: 25,
      y: 25
    },
    number: Math.floor(10 * Math.random()),
    pressingRight: false,
    pressingLeft: false,
    pressingUp: false,
    pressingDown: false,
    maxSpd: 10,
    updatePosition() {
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

          socket.on('joinChat', () => {
            socket.data.name = socket.id;
            socket.data.x = 0;
            socket.data.y = 0;
            let stringName = socket.data.name;
            SOCKET_LIST[stringName] = socket;

            let player = Player(socket.id);
            PLAYER_LIST[socket.id] = player;
          });
          // Handle socket events here
          socket.on('disconnect', () => {
            console.log('user disconnected');
            delete SOCKET_LIST[socket.id];
            delete PLAYER_LIST[socket.id];
          });

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
            io.emit('message', msg);
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

setInterval(() => {
  let pack = [];
  for (let key in PLAYER_LIST) {
    let player = PLAYER_LIST[key];
    player.updatePosition();
    pack.push({
      id: player.name,
      x: player.data.x,
      y: player.data.y,
    });
  }
  for (let key in SOCKET_LIST) {
    let socket = SOCKET_LIST[key];
    socket.emit('newPositions', pack);
  }
}, 1000 / 25);
