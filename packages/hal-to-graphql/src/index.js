const SwaggerParser = require('swagger-parser');
const apiToSchema = require('./api-to-schema');

module.exports = function createGraphQLServer(swaggerDefinitionPath) {
	return SwaggerParser.bundle(swaggerDefinitionPath)
		.then(apiToSchema)
		.catch(e => {
			console.log(e);
			throw new Error("Couldn't create schema", e);
		});
};
