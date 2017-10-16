const {
	generateCollectionResourcePath
} = require('../../src/rest-util');

module.exports = (resource) => ({
	[generateCollectionResourcePath(resource)]: {
		"get": {
			"operationId": `get${resource.pluralName}Collection`,
			"description": `Get all ${resource.pluralName}`,
			...(resource.parentParameters ?
				{ "parameters": resource.parentParameters } :
				{}
			),
			"responses": {
				"200": {
					"description": `Successfully retrieved all ${resource.pluralName}`,
					"schema": {
						"$ref": `#/definitions/${resource.resourceName || resource.pluralName}Collection`,
					}
				}
			}
		}
	}
});
