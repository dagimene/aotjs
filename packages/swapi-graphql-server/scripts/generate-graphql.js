const {
	printSchema,
	introspectionQuery,
	graphql
} = require('graphql');
const fs = require('fs');
const path = require('path');

const createGraphQLSchema = require('@aot/hal-to-graphql');
const swaggerDefinitionPath = require.resolve('@aot/swapi-hal-server/generated/swapi.yaml');

createGraphQLSchema(swaggerDefinitionPath).then(schema => {
	const generatedSchemaPath = path.resolve(__dirname, '../generated/swapi.graphql');

	fs.writeFile(generatedSchemaPath, printSchema(schema), (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`GraphQL Schema written to ${generatedSchemaPath}`);
		}
	});

	const generatedIntrospectionResultPath = path.resolve(__dirname, '../generated/swapi-introspection.json');
	graphql(schema, introspectionQuery, {})
		.then(introspectionResult => {
			fs.writeFile(generatedIntrospectionResultPath, JSON.stringify(introspectionResult, null, '  '), (err) => {
				if (err) {
					console.error(err);
				} else {
					console.log(`GraphQL Schema written to ${generatedIntrospectionResultPath}`);
				}
			});
		});
});
