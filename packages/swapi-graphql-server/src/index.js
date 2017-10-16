const express = require('express');
const graphqlHTTP = require('express-graphql');
const PORT = process.env.PORT || 4000;

const app = express();
const createGraphQLSchema = require('@aot/hal-to-graphql');
const swaggerDefinitionPath = require.resolve('@aot/swapi-hal-server/generated/swapi.yaml');

createGraphQLSchema(swaggerDefinitionPath).then(schema => {
	app.use('/graphql', graphqlHTTP({
		schema,
		graphiql: true
	}));

	app.listen(PORT, (err) => {
		if (err) {
			console.error('Couldn\'t start GraphQL API', err);
		} else {
			console.log(`GraphQL API accessible on port ${PORT}`);
		}
	});
});
