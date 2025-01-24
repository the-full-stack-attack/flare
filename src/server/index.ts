import https from 'https';
import http from 'http';
import fs from 'fs';
import { Server } from 'socket.io';
import app from './app';
import database from './db/index';
import './db/models/index';

import('./db/index');

const PORT = 4000;

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
          console.log('a user connected');
          // Handle socket events here
          socket.on('disconnect', () => {
            console.log('user disconnected');
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
