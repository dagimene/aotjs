const express = require('express');
const graphqlHTTP = require('express-graphql');

const app = express();
const createGraphQLSchema = require('../../hal-to-graphql/src/index');
const swaggerDefinitionPath = require.resolve('../../swapi-hal-server/generated/swapi.yaml');

createGraphQLSchema(swaggerDefinitionPath).then(schema => {
	app.use('/graphql', graphqlHTTP({
		schema,
		graphiql: true
	}));

	app.listen(4000);
});
