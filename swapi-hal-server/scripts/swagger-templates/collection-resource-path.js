const {
	generateCollectionResourcePath
} = require('../../src/rest-util');

module.exports = (resource) => ({
	[generateCollectionResourcePath(resource)]: {
		"get": {
			"operationId": `get${resource.pluralName}Collection`,
			...(resource.parentParameters ?
				{ "parameters": resource.parentParameters } :
				{}
			),
			"responses": {
				"200": {
					"description": "successful operation",
					"schema": {
						"$ref": `#/definitions/${resource.resourceName || resource.pluralName}Collection`,
					}
				}
			}
		}
	}
});
