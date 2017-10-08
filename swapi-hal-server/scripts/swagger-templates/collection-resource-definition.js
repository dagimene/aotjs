const {
	getResourceDefinitionName,
	getCollectionResourceDefinitionName
} = require('../../src/rest-util');

module.exports = (resource) => ({
	[getCollectionResourceDefinitionName(resource)]: {
		"type": "array",
		"items": {
			"$ref": `#/definitions/${getResourceDefinitionName(resource)}`
		}
	}
});
