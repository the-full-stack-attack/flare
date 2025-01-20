require('./db/index.ts')
const { app } = require('./app.ts')
const https = require('https');
const PORT = 4000;
const fs = require('fs');
const { database }= require('./db/index.ts')

if (process.env.DEVELOPMENT === 'true') {
    database.sync({alter: true})
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
        console.log(`Listening on http://localhost:${PORT}`);
        })
    })
    .catch((err: Error) => { console.error(err, 'oops!')})
} else {
    const options = {
        cert: fs.readFileSync('/etc/letsencrypt/live/slayer.events/fullchain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/slayer.events/privkey.pem'),
    }
    https.createServer(options, app).listen(443)
}


