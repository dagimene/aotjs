const {
	flatMap,
} = require('lodash');

module.exports = (resource) => ({
	[`${resource.name}`]: {
		"type": "object",
		"properties": {
			"id": {
				"type": "string"
			},
			...resource.properties,
			...(resource.links ? {
				"_links": {
					"type": "object",
					"properties": Object.assign({},
						...flatMap(resource.links, (link, linkName) => ({
							[linkName]: {
								"type": "object",
								"x-operation-id": `get${link.collection ? resource.name : ''}${link.resource}${link.collection ? 'Collection' : ''}`,
								"allOf": [
									{
										"$ref": "#/definitions/Link"
									}
								]
							}
						}))
					),
				}
			} : {})
		}
	}
});
