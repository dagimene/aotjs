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
			"description": `Get all ${resource.pluralName} related to a ${resource.parent.name}`,
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
					"description": `Successfully retrieved all ${resource.pluralName} related to the ${resource.parent.name}`,
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

