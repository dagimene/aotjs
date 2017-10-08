const axios = require('axios');
const UrlTemplate = require('url-template');
const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLSchema
} = require('graphql');

const {
	map,
	mapValues,
} = require('lodash');

const {
	pickBy,
	omit,
	flow
} = require('lodash/fp');

const SCALARS_MAP = {
	string: GraphQLString,
	integer: GraphQLInt,

};

module.exports = function apiToSchema(api) {

	const URL_PREFIX = `http://${api.host}${api.basePath.slice(0, -1)}`

	const objectTypeDefinitions = flow(
		pickBy(definition => definition.type === 'object'),
		omit('Link')
	)(api.definitions);

	const listTypeDefinitions = flow(
		pickBy(definition => definition.type === 'array'),
		omit('Link')
	)(api.definitions);

	const objectTypes = mapValues(objectTypeDefinitions, (definition, name) =>
		new GraphQLObjectType({
			name,
			fields: () => {
				if (definition.type === 'array') {
					return {

					};
				}
				const { _links, ...properties } = definition.properties;
				return Object.assign({}, {
					...mapValues(properties, property => ({
						type: SCALARS_MAP[ property.type ]
					})),
					...mapValues(_links.properties, (link, linkName) => ({
						type: queryFields[link['x-operation-id']].type,
						resolve: createLinkFieldResolver(linkName)
					}))
				});
			}
		})
	);

	const listTypes = mapValues(listTypeDefinitions, (definition, name) =>
		new GraphQLList(objectTypeFromRef(definition.items.$ref))
	);

	const types = {
		...objectTypes,
		...listTypes
	};

	console.log(Object.keys(types));

	const queryFields = Object.assign({},
		...map(api.paths, (path, url) => {
			const operation = path.get;
			const parameters = operation.parameters;
			const response = operation.responses[ '200' ];
			const type = typeFromRef(response.schema.$ref);
			return {
				[operation.operationId]: {
					type,
					...(parameters ? {
						args: Object.assign({},
							...parameters.map(parameter => ({
								[parameter.name]: {
									description: parameter.description,
									type: SCALARS_MAP[parameter.type]
								}
							}))
						)
					} : {}),
					resolve: createQueryFieldResolver(url, parameters)
				}
			};
		})
	);

	const query = new GraphQLObjectType({
		name: 'Query',
		fields: queryFields
	});

	return new GraphQLSchema({
		query
	});

	function createQueryFieldResolver(url, parameters) {
		const buildUrl = parameters ?
			UrlTemplate.parse(url).expand :
			() => url;

		return (source, args) => {
			const url = URL_PREFIX + buildUrl(args);
			return axios.get(url)
				.then(({ data }) => data);
		};
	}

	function createLinkFieldResolver(linkName) {
		return source => {
			const link = source._links[linkName];
			if (!link) {
				return null;
			}
			const url = link.href;
			console.log(url);
			return axios.get(url)
				.then(({ data }) => data);
		};
	}

	function typeFromRef(ref) {
		return types[ typeNameFromRef(ref) ];
	}

	function objectTypeFromRef(ref) {
		return objectTypes[ typeNameFromRef(ref) ];
	}

	function typeNameFromRef(ref) {
		return ref.split('/').pop();
	}
};
