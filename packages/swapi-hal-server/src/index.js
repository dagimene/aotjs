const app = require('express')();
const api = require('./swapi-api');
const PORT = process.env.PORT || 3000;

app.use('/apis/v0', api);

app.listen(PORT, (err) => {
	if (err) {
		console.error('Couldn\'t start HAL API', err);
	} else {
		console.log(`HAL API accessible on port ${PORT}`);
	}
});

