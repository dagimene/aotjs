const {
	describe,
	it
} = require('mocha');

const {
	expect
} = require('chai');

const {
	printSchema,
	introspectionQuery,
	graphql
} = require('graphql');

const fs = require('fs');
const path = require('path');

const sourceFull = require('./source-full');
const sourceSmall = require('./source-small');
const apiToSchema = require('../src/api-to-schema');

describe('hal-to-graphql', function() {
	it('should create small graphql schema', function() {
		const schema = apiToSchema(sourceSmall);
		const expected = JSON.parse(fs.readFileSync(require.resolve('./expected-small')));
		dumpSchema(schema, 'result-small');
		return graphql(schema, introspectionQuery, {})
			.then(introspectionResult => {
				dumpInstrospectionResult(introspectionResult, 'result-small');
				expect(introspectionResult).to.deep.equal(expected);
			});
	});

	it('should create full graphql schema', function() {
		const schema = apiToSchema(sourceFull);
		const expected = JSON.parse(fs.readFileSync(require.resolve('./expected-full')));
		dumpSchema(schema, 'result-full');
		return graphql(schema, introspectionQuery, {})
			.then(introspectionResult => {
				dumpInstrospectionResult(introspectionResult, 'result-full');
				expect(introspectionResult).to.deep.equal(expected);
			});
	});

	function dumpInstrospectionResult(introspectionResult, name) {
		fs.writeFileSync(path.resolve(__dirname, `./${name}.json`), JSON.stringify(introspectionResult, null, '  '));
	}

	function dumpSchema(schema, name) {
		const schemaPrinted = printSchema(schema);
		fs.writeFileSync(path.resolve(__dirname, `./${name}.graphql`), schemaPrinted);
	}
});
