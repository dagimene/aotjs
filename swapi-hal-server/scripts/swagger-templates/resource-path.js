const {
	camelCase,
	kebabCase,
} = require('lodash');

module.exports = (resource) => ({
	[`${resource.parentPath || ''}/${kebabCase(resource.pluralName)}/{${camelCase(resource.name)}Id}`]: {
		"get": {
			"operationId": `get${resource.name}`,
			"parameters": [
				...(resource.parentParameters || []),
				{
					"name": `${camelCase(resource.name)}Id`,
					"in": "path",
					"description": `ID of the \`${resource.name}\` to return`,
					"required": true,
					"type": "string",
				}
			],
			"responses": {
				"200": {
					"description": "successful operation",
					"schema": {
						"$ref": `#/definitions/${resource.name}`,
					}
				},
				"404": {
					"description": `\`${resource.name}\` not found`
				}
			}
		}
	}
});

