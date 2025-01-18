const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(express.static(path.resolve(__dirname, '../../dist')))
app.use(express.json());


app.use(
    cors({
        origin: 'http://localhost:8080',
        credentials: true,
    }))


module.exports = {
    app
}
