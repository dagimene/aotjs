const app = require('express')();
const api = require('./swapi-api');
const PORT = process.env.PORT || 3000;

app.use('/apis/v0', api);

app.listen(PORT);

console.log(`APP listening on port ${PORT}`);
