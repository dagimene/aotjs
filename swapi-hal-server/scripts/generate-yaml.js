const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const {
	camelCase,
	kebabCase,
	flatMap,
	filter
} = require('lodash');
const description = require('../swapi-resources');

const apiHeader = require('./swagger-templates/header');
const apiDefinitions = require('./swagger-templates/definitions');
const apiCollectionResourceDefinitionTemplate = require('./swagger-templates/collection-resource-definition');
const apiCollectionResourcePathTemplate = require('./swagger-templates/collection-resource-path');
const apiResourceDefinitionTemplate = require('./swagger-templates/resource-definition');
const apiResourcePathTemplate = require('./swagger-templates/resource-path');

function getSubResources(resource) {
	if (!resource.links) {
		return [];
	}

	return filter(resource.links, link => link.collection)
		.map(link => ({
			resourceName: link.resource,
			pluralName: resource.name + link.resource,
			parentParameters: [{
				"name": `${camelCase(resource.name)}Id`,
				"in": "path",
				"description": `ID of the parent \`${resource.name}\``,
				"required": true,
				"type": "string",
			}],
			parentPath: `/${kebabCase(resource.pluralName)}/{${camelCase(resource.name)}Id}`
		}));
}

const apiDefinition = Object.assign({
	...apiHeader,
	paths: Object.assign({},
		...flatMap(description.resources, resource => [
			...(resource.pluralName ? [ apiCollectionResourcePathTemplate(resource) ] : []),
			apiResourcePathTemplate(resource),
			...getSubResources(resource).map(subrsource => apiCollectionResourcePathTemplate(subrsource)),
		])
	),
	definitions: Object.assign({},
		...flatMap(description.resources, resource => [
			...(resource.pluralName ? [ apiCollectionResourceDefinitionTemplate(resource) ] : []),
			apiResourceDefinitionTemplate(resource)
		]),
		apiDefinitions
	)
});


const yamlContent = YAML.safeDump(apiDefinition);
console.log(yamlContent);

fs.writeFileSync(path.resolve(__dirname, '../generated/swapi.yaml'), yamlContent);

