require('./db/index.ts')
const { app } = require('./app.ts')
const https = require('https');
const PORT = 4000;
const fs = require('fs');


if (process.env.DEVELOPMENT === 'true') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Listening on http://localhost:${PORT}`);
    });
} else {
    const options = {
        cert: fs.readFileSync('/etc/letsencrypt/live/slayer.events/fullchain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/slayer.events/privkey.pem'),
    }
    https.createServer(options, app).listen(443)
}


