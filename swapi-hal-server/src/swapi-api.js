const { Router } = require('express');
const {
	lowerCase,
	flatMap,
	filter,
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
} = require('../src/rest-util');

const REMOTE_BASE_URL = "https://swapi.co/api";
const LOCAL_BASE_URL = "http://localhost:8080/apis/v0";

const remoteCollectionResourceUrl = resourceType => `${REMOTE_BASE_URL}/${resourceType}`;
const remoteResourceUrl = (resourceType, id) => `${remoteCollectionResourceUrl(resourceType)}/${id}`;

const apiDefinition = require('../swapi-resources');

const router = Router();

forEach(apiDefinition.resources, resource => {
	const resourceType = lowerCase(resource.pluralName);
	const idParameter = generateResourceIdParameterName(resource);

	if (resource.pluralName) {
		const getCollectionResourcePath = swaggerToExpressRoute(generateCollectionResourcePath(resource));
		router.get(getCollectionResourcePath, (req, res) => {
			console.log(`IN: GET ${getCollectionResourcePath}`);
			fetchUrl(remoteCollectionResourceUrl(resourceType))
				.then(({ data }) => {
					res.json(transformCollectionResource(resource, data.results));
				})
				.catch(e => handleError(e, res));
		});

		forEach(resource.links, (link, linkName) => {
			if (!link.collection) {
				return;
			}

			let getSubResourcePath = swaggerToExpressRoute(generateSubResourcePath({ parent: resource, pluralName: link.resource }));
			router.get(getSubResourcePath, (req, res) => {
				console.log(`IN: GET ${getSubResourcePath}`);
				fetchSingleResource(req)
					.then(({ data }) => Promise.all((data[linkName] || []).map(url =>
						fetchUrl(LOCAL_BASE_URL + getResourceLink({ pluralName: link.resource }, getResourceId(url)))
							.then(({ data }) => data)
					)))
					.then(collection => res.json(collection))
					.catch(e => handleError(e, res));
			});
		});
	}

	let getResourcePath = swaggerToExpressRoute(generateResourcePath(resource));
	router.get(getResourcePath, (req, res) => {
		console.log(`IN: GET ${getResourcePath}`);
		fetchSingleResource(req)
			.then(({ data }) => {
				res.json(transformResource(resource, data));
			})
			.catch(e => handleError(e, res));
	});

	function fetchSingleResource(req) {
		return fetchUrl(remoteResourceUrl(resourceType, req.params[idParameter]))
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
	return {
		...pick(instance, Object.keys(resource.properties)),
		_links: Object.assign({
				self: instantiateSelfLink(resource, instance)
			},
			...flatMap(resource.links || [], (link, linkName) => ({
				[linkName]: instantiateLink(link, linkName, instance, resource)
			}))
		)
	};
}

function instantiateLink(link, linkName, parentInstance, parentResource) {
	const remoteUrl = link.collection ? parentInstance.url : parentInstance[linkName];
	if (!remoteUrl) {
		return null;
	}

	const id = getResourceId(remoteUrl);
	const childResource = apiDefinition.resources[link.resource];
	const href = LOCAL_BASE_URL + (link.collection ?
		getSubResourceLink({
			...childResource,
			parent: parentResource
		}, id) :
		getResourceLink(childResource, id));
	return { href };
}

function instantiateSelfLink(resource, instance) {
	const href = LOCAL_BASE_URL + getResourceLink(resource, getResourceId(instance.url));

	return { href };
}

function swaggerToExpressRoute(path) {
	return path.replace(/{(\w+)}/g, (match, group) => `:${group}`);
}

function getResourceId(url) {
	return url.split('/').splice(-2, 1);
}

function handleError(e, res) {
	console.log(e);
	res.status(500).end();
}

module.exports = router;
