/* @flow */

declare type GraphQLResponseRoot = {
  data?: Query;
  errors?: Array<GraphQLResponseError>;
}

declare type GraphQLResponseError = {
  message: string;            // Required for all errors
  locations?: Array<GraphQLResponseErrorLocation>;
  [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
}

declare type GraphQLResponseErrorLocation = {
  line: number;
  column: number;
}

declare type Query = {
  /** Get all Films */
  getFilmsCollection: ?Array<Film>;
  /** Get a single Film */
  getFilm: ?Film;
  /** Get all People related to a Film */
  getFilmPeopleCollection: ?Array<Person>;
  /** Get all Vehicles related to a Film */
  getFilmVehiclesCollection: ?Array<Vehicle>;
  /** Get all Starships related to a Film */
  getFilmStarshipsCollection: ?Array<Starship>;
  /** Get all Species related to a Film */
  getFilmSpeciesCollection: ?Array<Species>;
  /** Get all Planets related to a Film */
  getFilmPlanetsCollection: ?Array<Planet>;
  /** Get all People */
  getPeopleCollection: ?Array<Person>;
  /** Get a single Person */
  getPerson: ?Person;
  /** Get all Films related to a Person */
  getPersonFilmsCollection: ?Array<Film>;
  /** Get all Vehicles related to a Person */
  getPersonVehiclesCollection: ?Array<Vehicle>;
  /** Get all Starships related to a Person */
  getPersonStarshipsCollection: ?Array<Starship>;
  /** Get all Species related to a Person */
  getPersonSpeciesCollection: ?Array<Species>;
  /** Get all Planets */
  getPlanetsCollection: ?Array<Planet>;
  /** Get a single Planet */
  getPlanet: ?Planet;
  /** Get all Films related to a Planet */
  getPlanetFilmsCollection: ?Array<Film>;
  /** Get all People related to a Planet */
  getPlanetPeopleCollection: ?Array<Person>;
  /** Get all Species */
  getSpeciesCollection: ?Array<Species>;
  /** Get a single Species */
  getSpecies: ?Species;
  /** Get all People related to a Species */
  getSpeciesPeopleCollection: ?Array<Person>;
  /** Get all Films related to a Species */
  getSpeciesFilmsCollection: ?Array<Film>;
  /** Get all Vehicles */
  getVehiclesCollection: ?Array<Vehicle>;
  /** Get a single Vehicle */
  getVehicle: ?Vehicle;
  /** Get all People related to a Vehicle */
  getVehiclePeopleCollection: ?Array<Person>;
  /** Get all Films related to a Vehicle */
  getVehicleFilmsCollection: ?Array<Film>;
  /** Get all Starships */
  getStarshipsCollection: ?Array<Starship>;
  /** Get a single Starship */
  getStarship: ?Starship;
  /** Get all People related to a Starship */
  getStarshipPeopleCollection: ?Array<Person>;
  /** Get all Films related to a Starship */
  getStarshipFilmsCollection: ?Array<Film>;
}

/**
  A Star Wars film
*/
declare type Film = {
  id: string;
  opening_crawl: ?string;
  episode_id: ?number;
  edited: ?string;
  director: ?string;
  release_date: ?string;
  title: ?string;
  producer: ?string;
  created: ?string;
  self: ?Film;
  characters: ?Array<Person>;
  vehicles: ?Array<Vehicle>;
  starships: ?Array<Starship>;
  species: ?Array<Species>;
  planets: ?Array<Planet>;
}

/**
  A person within the Star Wars universe
*/
declare type Person = {
  id: string;
  skin_color: ?string;
  birth_year: ?string;
  name: ?string;
  edited: ?string;
  gender: ?string;
  height: ?string;
  hair_color: ?string;
  created: ?string;
  mass: ?string;
  eye_color: ?string;
  self: ?Person;
  films: ?Array<Film>;
  homeworld: ?Planet;
  vehicles: ?Array<Vehicle>;
  starships: ?Array<Starship>;
  species: ?Array<Species>;
}

/**
  A planet.
*/
declare type Planet = {
  id: string;
  orbital_period: ?string;
  name: ?string;
  population: ?string;
  edited: ?string;
  gravity: ?string;
  surface_water: ?string;
  rotation_period: ?string;
  terrain: ?string;
  climate: ?string;
  created: ?string;
  diameter: ?string;
  self: ?Planet;
  films: ?Array<Film>;
  residents: ?Array<Person>;
}

/**
  A vehicle.
*/
declare type Vehicle = {
  id: string;
  created: ?string;
  vehicle_class: ?string;
  consumables: ?string;
  cargo_capacity: ?string;
  name: ?string;
  cost_in_credits: ?string;
  edited: ?string;
  model: ?string;
  passengers: ?string;
  max_atmosphering_speed: ?string;
  manufacturer: ?string;
  length: ?string;
  crew: ?string;
  self: ?Vehicle;
  pilots: ?Array<Person>;
  films: ?Array<Film>;
}

/**
  A Starship
*/
declare type Starship = {
  id: string;
  created: ?string;
  hyperdrive_rating: ?string;
  consumables: ?string;
  MGLT: ?string;
  name: ?string;
  cost_in_credits: ?string;
  cargo_capacity: ?string;
  starship_class: ?string;
  model: ?string;
  edited: ?string;
  passengers: ?string;
  max_atmosphering_speed: ?string;
  manufacturer: ?string;
  length: ?string;
  crew: ?string;
  self: ?Starship;
  pilots: ?Array<Person>;
  films: ?Array<Film>;
}

/**
  A species within the Star Wars universe
*/
declare type Species = {
  id: string;
  average_height: ?string;
  name: ?string;
  classification: ?string;
  edited: ?string;
  designation: ?string;
  language: ?string;
  hair_colors: ?string;
  skin_colors: ?string;
  created: ?string;
  eye_colors: ?string;
  average_lifespan: ?string;
  self: ?Species;
  people: ?Array<Person>;
  films: ?Array<Film>;
  homeworld: ?Planet;
}