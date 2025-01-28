/* eslint-disable no-param-reassign */
import https from 'https';
import http from 'http';
import fs from 'fs';
import { Server, Socket as OriginalSocket } from 'socket.io';
import app from './app';
import database from './db/index';
import './db/models/index';
import { data } from 'react-router';
import './workers/tasks';
import { type SocketList, PlayerList } from '../types/Players'
import initializeSocket from './socket'

const PORT = 4000;


const SOCKET_LIST: SocketList = {};
const PLAYER_LIST: PlayerList = {};

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
        const io = initializeSocket(server, PLAYER_LIST, SOCKET_LIST )
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
  if (process.env.SOCKET !== 'true') {
    database
      .sync({ alter: true })
      .then(() => {
        https.createServer(options, app).listen(443);
      });
  } else { 
    database
    .sync({ alter: true })
    .then(() => {
      let httpsServer = https.createServer(options, app)
      const io = initializeSocket(httpsServer, PLAYER_LIST, SOCKET_LIST )
      httpsServer.listen(443);
    });
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
      room: player.eventId,
    });
  }
  // loop through the sockets and send the package to each of them
  for (let key in SOCKET_LIST) {
    let socket = SOCKET_LIST[key];
    socket.to(socket.data.room).emit('newPositions', pack);
  }
}, 1000 / 25);
