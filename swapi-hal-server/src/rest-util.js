const {
	camelCase,
	kebabCase,
} = require('lodash');

module.exports = {
	generateResourcePath,
	generateCollectionResourcePath,
	generateSubResourcePath(resource) {
		return `${generateResourcePath(resource.parent)}/${kebabCase(resource.pluralName)}`;
	},
	generateResourceIdParameterName,
	generateResourceOperationId(resource) {
		return `get${resource.name}`;
	},
	generateCollectionResourceOperationId(resource) {
		return `get${resource.pluralName}Collection`;
	},
	generateSubResourceOperationId(resource) {
		return `get${resource.parent.name}${resource.pluralName}Collection`;
	},
	getResourceDefinitionName(resource) {
		return resource.name;
	},
	getCollectionResourceDefinitionName(resource) {
		return `${resource.pluralName}Collection`;
	},
	getResourceLink(resource, id) {
		return `/${kebabCase(resource.pluralName)}/${id}`;
	},
	getSubResourceLink(resource, parentId) {
		return `${generateCollectionResourcePath(resource.parent)}/${parentId}/${kebabCase(resource.pluralName)}`;
	}
};

function generateCollectionResourcePath(resource) {
	return `/${kebabCase(resource.pluralName)}`;
}

function generateResourcePath(resource) {
	return `${generateCollectionResourcePath(resource)}/{${generateResourceIdParameterName(resource)}}`;
}

function generateResourceIdParameterName(resource) {
	return `${camelCase(resource.name)}Id`;
}
