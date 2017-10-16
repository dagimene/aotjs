# AoT - Autogeneration of Things
This repository includes examples on generating of the following things:

- [GraphQL Server from a HAL API](#hal-to-graphql)
- [Flowtype definitions from GraphQL Server Introspection](#graphql-to-flowtype)
- [GraphQL Mock Server from GraphQL Server Introspection](#graphql-mock-server)

It also includes a HAL wrapper on top of SWAPI

This repository has been setup with lerna to manage multiple npm packages and applications.

## HAL to GraphQL

The HAL to GraphQL transformation consists of taking an OpenAPI spec and starting a GraphQL server from it.
The schema objects structure is infered from the relations of the REST API resources, declared in the API yaml file.
For the fields resolution, the resources hypemedia obtained from the REST API is used to fetch related resources.

`@aot/hal-to-graphql` npm package generates a graphql schema from a REST specification.
`@aot/swapi-graphql-server` utilizes that package to start a GraphQL server from SWAPI HAL API, which is defined in
`@aot/swapi-hal-server` package.

There are many different ways in which hypermedia can be declared in an OpenAPI specification. This examples
include a custom vendor extension called `x-operation-id` on each resource link definition, but other ways of linking
resources could have been used. Also, each API may follow differnet patterns and adhere to standards that may impose
requirements for the HAL to GraphQL mapping. For this reason `@aot/hal-to-graphql` is not meant to be a package that could
transform any HAL API into a GraphQL server, but instead it's a rather simple example implementation of the concept.

## GraphQL to Flowtype

Flow type definitons can be generated from a GraphQL server, reducing the initial efforts to adopt flow in a GraphQL
client application. `gql2flow` npm package can be used to generate definitions from GraphQL server. You can see an example
for our SWAPI GraphQL server in `@aot/swapi-flow` package.

## GraphQL Mock Server

The typed and structure nature of GraphQL makes it easy to generate a reasonable Mock server from a GraphQL. There are
several tools in the public npm registry that tackle this problem. In `@aot/swapi-mock-server` package there's a minimal
example that bootstraps a GraphQL Mock server for the API in `@aot/swapi-graphql-server`, using Apollo's `graphql-tools`
package.
