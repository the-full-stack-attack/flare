/* eslint-disable no-param-reassign */
import https from 'https';
import http from 'http';
import fs from 'fs';
import { Server, Socket as OriginalSocket } from 'socket.io';
import app from './app';
import database from './db/index';
import './db/models/index';
import { data } from 'react-router';
import './workers/tasks'; // Tasks Worker
import './workers/texts'; // Texts Worker
import { type SocketList, PlayerList, QuiplashList, QuiplashGames } from '../types/Players';
import initializeSocket from './socket';

const PORT = 4000;


const SOCKET_LIST: SocketList = {};
const PLAYER_LIST: PlayerList = {};
const QUIPLASH_LIST: QuiplashList = {};
const QUIPLASH_GAMES: QuiplashGames = {};

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
        const io = initializeSocket(server, PLAYER_LIST, SOCKET_LIST, QUIPLASH_LIST, QUIPLASH_GAMES)
        server.listen(4000, () => {
          console.log(`Listening on http://localhost:${PORT}`);
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

    // START SERVER AS NORMAL
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
      const io = initializeSocket(httpsServer, PLAYER_LIST, SOCKET_LIST, QUIPLASH_LIST, QUIPLASH_GAMES)
      httpsServer.listen(443);
    });
  }
}

// Async function, updates chatroom state based on all player positions in list

