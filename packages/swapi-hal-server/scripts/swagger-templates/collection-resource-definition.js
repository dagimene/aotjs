const {
	getResourceDefinitionName,
	getCollectionResourceDefinitionName
} = require('../../src/rest-util');

module.exports = (resource) => ({
	[getCollectionResourceDefinitionName(resource)]: {
		"type": "array",
		"description": `A collection of ${resource.pluralName}`,
		"items": {
			"$ref": `#/definitions/${getResourceDefinitionName(resource)}`
		}
	}
});
