const {
	flatMap,
} = require('lodash');

const {
	generateResourceOperationId,
	generateSubResourceOperationId,
	getResourceDefinitionName
} = require('../../src/rest-util');

module.exports = (resource, apiDefinitions) => ({
	[getResourceDefinitionName(resource)]: {
		"type": "object",
		"properties": {
			"id": {
				"type": "string"
			},
			...resource.properties,
			"_links": {
				"type": "object",
				"properties": Object.assign({
						self: {
							"type": "object",
							"x-operation-id": generateResourceOperationId(resource),
							"allOf": [
								{
									"$ref": "#/definitions/Link"
								}
							]
						}
					},
					...flatMap(resource.links, (link, linkName) => ({
						[linkName]: {
							"type": "object",
							"x-operation-id": link.collection ?
								generateSubResourceOperationId({
									...apiDefinitions.resources[link.resource],
									parent: resource
								}) :
								generateResourceOperationId(apiDefinitions.resources[link.resource]),
							"allOf": [
								{
									"$ref": "#/definitions/Link"
								}
							]
						}
					}))
				),
			}
		}
	}
});
