const {
	lowerCase,
	flatMap,
	forEach,
	pick
} = require('lodash');
const axios = require('axios');
const {
	generateSubResourcePath,
	generateResourcePath,
	generateCollectionResourcePath,
	getResourceLink,
	getSubResourceLink,
	generateResourceIdParameterName
} = require('./rest-util');

const REMOTE_BASE_URL = "https://swapi.co/api";
const LOCAL_BASE_URL = "https://apis.aotjs.com/swapi/v0";

const remoteCollectionResourceUrl = resourceType => `${REMOTE_BASE_URL}/${resourceType}`;
const remoteResourceUrl = (resourceType, id) => `${remoteCollectionResourceUrl(resourceType)}/${id}`;

const apiDefinition = require('./swapi-resources');

const endpoints = {};

forEach(apiDefinition.resources, resource => {
	const resourceType = lowerCase(resource.pluralName);
	const idParameter = generateResourceIdParameterName(resource);

	if (resource.pluralName) {
		const getCollectionResourcePath = generateCollectionResourcePath(resource);
		endpoints[getCollectionResourcePath] = () => {
			console.log(`IN: GET ${getCollectionResourcePath}`);
			return fetchUrl(remoteCollectionResourceUrl(resourceType))
				.then(({ data }) => transformCollectionResource(resource, data.results));
		};

		forEach(resource.links, (link, linkName) => {
			if (!link.collection) {
				return;
			}

			let getSubResourcePath = generateSubResourcePath({ parent: resource, pluralName: link.resource });
			endpoints[getSubResourcePath] = req => {
				console.log(`IN: GET ${getSubResourcePath}`);
				return fetchSingleResource(req)
					.then(({ data }) => Promise.all((data[linkName] || []).map(url => {
						const subResource = apiDefinition.resources[ link.resource ];
						return endpoints[ generateResourcePath(subResource) ]({
							pathParameters: {
								[generateResourceIdParameterName(subResource)]: getResourceId(url)
							}
						});
					})));
			};
		});
	}

	let getResourcePath = generateResourcePath(resource);
	endpoints[getResourcePath] = req => {
		console.log(`IN: GET ${getResourcePath}`);
		return fetchSingleResource(req)
			.then(({ data }) => transformResource(resource, data));
	};

	function fetchSingleResource(req) {
		return fetchUrl(remoteResourceUrl(resourceType, req.pathParameters[idParameter]))
	}
});

function fetchUrl(url) {
	console.log(`OUT: GET ${url} - request sent`);

	return axios.get(url)
		.catch(e => {
			console.error(`OUT: GET ${url} - request failed`, e);

			throw e;
		});
}

function transformCollectionResource(resource, collection) {
	return collection.map(instance => transformResource(resource, instance));
}

function transformResource(resource, instance) {
	return Object.assign({},
		pick(instance, Object.keys(resource.properties)),
		{
			_links: Object.assign({
					self: instantiateSelfLink(resource, instance)
				},
				...flatMap(resource.links || [], (link, linkName) => ({
					[linkName]: instantiateLink(link, linkName, instance, resource)
				}))
			)
		}
	);
}

function instantiateLink(link, linkName, parentInstance, parentResource) {
	const remoteUrl = link.collection ? parentInstance.url : parentInstance[linkName];
	if (!remoteUrl) {
		return null;
	}

	const id = getResourceId(remoteUrl);
	const childResource = apiDefinition.resources[link.resource];
	const href = LOCAL_BASE_URL + (link.collection ?
		getSubResourceLink(Object.assign({},
			childResource,
			{ parent: parentResource }
		), id) :
		getResourceLink(childResource, id));
	return { href };
}

function instantiateSelfLink(resource, instance) {
	const href = LOCAL_BASE_URL + getResourceLink(resource, getResourceId(instance.url));

	return { href };
}

function getResourceId(url) {
	return url.split('/').splice(-2, 1);
}

module.exports = endpoints;
