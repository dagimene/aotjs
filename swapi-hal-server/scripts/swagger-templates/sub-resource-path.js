const {
	generateSubResourcePath,
	generateResourceIdParameterName,
	generateSubResourceOperationId,
	getCollectionResourceDefinitionName
} = require('../../src/rest-util');

module.exports = (resource) => ({
	[generateSubResourcePath(resource)]: {
		"get": {
			"operationId": generateSubResourceOperationId(resource),
			"parameters": [
				{
					"name": generateResourceIdParameterName(resource.parent),
					"in": "path",
					"description": `ID of the parent \`${resource.parent.name}\``,
					"required": true,
					"type": "string",
				}
			],
			"responses": {
				"200": {
					"description": "successful operation",
					"schema": {
						"$ref": `#/definitions/${getCollectionResourceDefinitionName(resource)}`,
					}
				},
				"404": {
					"description": `\`${resource.name}\` not found`
				}
			}
		}
	}
});

