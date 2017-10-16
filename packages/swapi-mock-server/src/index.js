const express = require('express');
const graphqlHTTP = require('express-graphql');

const { buildClientSchema } = require('graphql');
const { addMockFunctionsToSchema } = require('graphql-tools');

const introspectionResult = require('@aot/swapi-graphql-server/generated/swapi-introspection');
const schema = buildClientSchema(introspectionResult.data);
addMockFunctionsToSchema({ schema });

const PORT = process.env.PORT || 5000;

const app = express();

app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true
}));

app.listen(PORT, (err) => {
	if (err) {
		console.error('Couldn\'t start GraphQL API', err);
	} else {
		console.log(`GraphQL Mock API accessible on port ${PORT}`);
	}
});
