const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const {
	flatMap,
	filter
} = require('lodash');
const apiDefinitions = require('../swapi-resources.json');

const {
	generateResourcePath,
	generateResourceIdParameterName
} = require('../src/rest-util');

const apiHeader = require('./swagger-templates/header');
const apiResourceDefinitions = require('./swagger-templates/definitions');
const apiCollectionResourceDefinitionTemplate = require('./swagger-templates/collection-resource-definition');
const apiCollectionResourcePathTemplate = require('./swagger-templates/collection-resource-path');
const apiSubResourcePathTemplate = require('./swagger-templates/sub-resource-path');
const apiResourceDefinitionTemplate = require('./swagger-templates/resource-definition');
const apiResourcePathTemplate = require('./swagger-templates/resource-path');

function getSubResources(resource) {
	if (!resource.links) {
		return [];
	}

	return filter(resource.links, link => link.collection)
		.map(link => ({
			parent: resource,
			pluralName: link.resource
		}));
}

const apiDefinition = Object.assign({
	...apiHeader,
	paths: Object.assign({},
		...flatMap(apiDefinitions.resources, resource => [
			...(resource.pluralName ? [ apiCollectionResourcePathTemplate(resource) ] : []),
			apiResourcePathTemplate(resource),
			...getSubResources(resource).map(apiSubResourcePathTemplate),
		])
	),
	definitions: Object.assign({},
		...flatMap(apiDefinitions.resources, resource => [
			...(resource.pluralName ? [ apiCollectionResourceDefinitionTemplate(resource) ] : []),
			apiResourceDefinitionTemplate(resource, apiDefinitions)
		]),
		apiResourceDefinitions
	)
});


console.log(JSON.stringify(apiDefinition, null, '  '));
const yamlContent = YAML.safeDump(apiDefinition);
console.log(yamlContent);

fs.writeFileSync(path.resolve(__dirname, '../generated/swapi.yaml'), yamlContent);
