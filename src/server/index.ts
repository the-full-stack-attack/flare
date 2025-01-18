const { app } = require('./app.ts')

const PORT = 4000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

