const {
	generateResourcePath,
	generateResourceIdParameterName,
	generateResourceOperationId,
	getResourceDefinitionName
} = require('../../src/rest-util');

module.exports = (resource) => ({
	[generateResourcePath(resource)]: {
		"get": {
			"operationId":generateResourceOperationId(resource),
			"description": `Get a single ${resource.name}`,
			"parameters": [
				{
					"name": generateResourceIdParameterName(resource),
					"in": "path",
					"description": `ID of the \`${resource.name}\` to return`,
					"required": true,
					"type": "string",
				}
			],
			"responses": {
				"200": {
					"description": `Successfully retrieved the requested ${resource.name}`,
					"schema": {
						"$ref": `#/definitions/${getResourceDefinitionName(resource)}`,
					}
				},
				"404": {
					"description": `\`${resource.name}\` not found`
				}
			}
		}
	}
});

