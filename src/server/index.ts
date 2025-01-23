import ('./db/index');
import { Server } from 'socket.io';
import https from 'https';
import fs from 'fs';
import app from './app';
import database from './db/index';

const PORT = 4000;

if (process.env.DEVELOPMENT === 'true') {
  database
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });
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
    console.log('connected', socket);
  });

  https.createServer(options, app).listen(443);
}
