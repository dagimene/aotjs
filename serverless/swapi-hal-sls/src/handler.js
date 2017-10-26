'use strict';

const swapi = require('./swapi-api');

module.exports.hal = (event, context, callback) => {
	console.log('received request', event.resource, event.pathParameters);

	const endpoint = swapi[event.resource];
	if (!endpoint) {
		console.log('endpoint not found', event.resource);
		callback(null, {
			statusCode: 404
		});
		return;
	}

	console.log('processing request', event.resource, event.pathParameters);

	endpoint(event)
		.then(response => {
			callback(null, {
				statusCode: 200,
				body: JSON.stringify(response),
			});
		})
		.catch(e => {
			console.error(e);
			callback(null, {
				statusCode: 500,
			});
		});
};
