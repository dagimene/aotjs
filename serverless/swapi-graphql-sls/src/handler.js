'use strict';

const { graphql } = require('graphql');
const createGraphQLSchema = require('@aot/hal-to-graphql');
const swaggerDefinitionPath = require.resolve('@aot/swapi-hal-server/generated/swapi.yaml');

const schemaPromise = createGraphQLSchema(swaggerDefinitionPath);
const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST,OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
};

module.exports.graphql = (event, context, callback) => {
	const query = JSON.parse(event.body).query;
	console.log('query: ', query);
	schemaPromise
		.then(schema => graphql(schema, query, {}))
		.then(responseBody => {
				callback(null, {
					statusCode: 200,
					body: JSON.stringify(responseBody),
					headers: CORS_HEADERS
				});
			}
		)
		.catch(e => {
			console.error(e);
			callback(null, {
				statusCode: 500,
				headers: CORS_HEADERS
			});
		});
};
