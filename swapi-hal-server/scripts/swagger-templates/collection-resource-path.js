const {
	kebabCase,
} = require('lodash');

module.exports = (resource) => ({
	[`${resource.parentPath || ''}/${kebabCase(resource.pluralName)}`]: {
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
