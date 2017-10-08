module.exports = (resource) => ({
	[`${resource.pluralName}Collection`]: {
		"type": "array",
		"items": {
			"$ref": `#/definitions/${resource.name}`
		}
	}
});
