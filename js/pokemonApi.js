/**
 * Loads one Pokemon by ID or reuses it from the cache.
 */
async function fetchPokemonById(pokemonId) {
  if (pokemonState.pokemonCache[pokemonId]) {
    return pokemonState.pokemonCache[pokemonId];
  }

  return await requestPokemon(pokemonId);
}


/**
 * Loads one Pokemon by name or reuses it from the cache.
 */
async function fetchPokemonByName(pokemonName) {
  const cachedPokemon = findCachedPokemonByName(pokemonName);
  return cachedPokemon || await requestPokemon(pokemonName);
}


/**
 * Loads all Pokemon whose names contain the search value.
 */
async function fetchPokemonsBySearchValue(searchValue) {
  const pokemonNames = await fetchMatchingPokemonNames(searchValue);
  const pokemonPromises = pokemonNames.map((name) => fetchPokemonByName(name));
  const pokemons = await Promise.all(pokemonPromises);
  return pokemons.filter((pokemon) => pokemon);
}


/**
 * Filters the cached Pokemon list by partial matches.
 */
async function fetchMatchingPokemonNames(searchValue) {
  const pokemonList = await fetchPokemonNameList();
  return pokemonList
    .filter((pokemon) => pokemon.name.includes(searchValue))
    .map((pokemon) => pokemon.name);
}


/**
 * Loads the Pokemon name list or reuses the cache.
 */
async function fetchPokemonNameList() {
  if (pokemonState.pokemonListCache) return pokemonState.pokemonListCache;
  pokemonState.pokemonListCache = await requestPokemonNameList();
  return pokemonState.pokemonListCache;
}


/**
 * Requests the Pokemon name list from the PokeAPI.
 */
async function requestPokemonNameList() {
  const listUrl = `${pokemonState.baseUrl}/pokemon?limit=${pokemonState.maxPokemonId}`;
  const listData = await requestJson(listUrl);
  return listData.results;
}


/**
 * Requests one Pokemon from the API and stores it in the cache.
 */
async function requestPokemon(searchValue) {
  const pokemonUrl = `${pokemonState.baseUrl}/pokemon/${encodeURIComponent(searchValue)}`;
  const response = await fetch(pokemonUrl);
  if (!response.ok) return null;
  const pokemon = mapPokemonData(await response.json());
  pokemonState.pokemonCache[pokemon.id] = pokemon;
  return pokemon;
}


/**
 * Finds one Pokemon by name in the existing cache.
 */
function findCachedPokemonByName(pokemonName) {
  return Object.values(pokemonState.pokemonCache).find((pokemon) => {
    return pokemon.name.toLowerCase() === pokemonName;
  });
}


/**
 * Loads multiple Pokemon from a start ID and amount.
 */
async function fetchPokemonRange(startId, amount) {
  const pokemonIds = createPokemonIdList(startId, amount);
  const pokemonPromises = pokemonIds.map((pokemonId) => fetchPokemonById(pokemonId));
  return await Promise.all(pokemonPromises);
}


/**
 * Creates a continuous list of Pokemon IDs.
 */
function createPokemonIdList(startId, amount) {
  const pokemonIds = [];

  for (let count = 0; count < amount; count++) {
    pokemonIds.push(startId + count);
  }

  return pokemonIds;
}


/**
 * Reduces the API data to the values the app needs.
 */
function mapPokemonData(pokemon) {
  return {
    id: pokemon.id,
    name: capitalizeFirstLetter(pokemon.name),
    image: pokemon.sprites.other["official-artwork"].front_default,
    speciesUrl: pokemon.species.url,
    height: pokemon.height,
    weight: pokemon.weight,
    types: pokemon.types.map((entry) => entry.type.name),
    stats: pokemon.stats.map((entry) => mapPokemonStat(entry)),
  };
}


/**
 * Reduces one stat entry to name and value.
 */
function mapPokemonStat(entry) {
  return {
    name: entry.stat.name,
    value: entry.base_stat,
  };
}


/**
 * Lazy-loads the evolution chain for the opened Pokemon.
 */
async function fetchEvolutionChain(pokemon) {
  const species = await fetchPokemonSpecies(pokemon.speciesUrl);
  const chain = await fetchEvolutionData(species.evolution_chain.url);
  return await mapEvolutionChain(chain.chain);
}


/**
 * Loads species data or reuses it from the cache.
 */
async function fetchPokemonSpecies(speciesUrl) {
  if (pokemonState.speciesCache[speciesUrl]) return pokemonState.speciesCache[speciesUrl];
  const species = await requestJson(speciesUrl);
  pokemonState.speciesCache[speciesUrl] = species;
  return species;
}


/**
 * Loads evolution data or reuses it from the cache.
 */
async function fetchEvolutionData(evolutionUrl) {
  if (pokemonState.evolutionCache[evolutionUrl]) return pokemonState.evolutionCache[evolutionUrl];
  const evolution = await requestJson(evolutionUrl);
  pokemonState.evolutionCache[evolutionUrl] = evolution;
  return evolution;
}


/**
 * Converts an evolution chain into dialog data.
 */
async function mapEvolutionChain(chain) {
  const evolutionNodes = collectEvolutionNodes(chain, null);
  return await Promise.all(evolutionNodes.map((node) => mapEvolutionNode(node)));
}


/**
 * Collects all evolution stages from the nested chain.
 */
function collectEvolutionNodes(chain, level) {
  const node = { name: chain.species.name, level };
  const nextNodes = chain.evolves_to.flatMap((entry) => {
    return collectEvolutionNodes(entry, getEvolutionLevel(entry));
  });
  return [node, ...nextNodes];
}


/**
 * Gets the evolution level if the API provides one.
 */
function getEvolutionLevel(entry) {
  return entry.evolution_details[0]?.min_level || null;
}


/**
 * Adds an image and formatted name to one evolution stage.
 */
async function mapEvolutionNode(node) {
  const pokemon = await fetchPokemonByName(node.name);
  return { name: pokemon.name, image: pokemon.image, level: node.level };
}


/**
 * Requests JSON data directly from an API URL.
 */
async function requestJson(url) {
  const response = await fetch(url);
  return await response.json();
}


/**
 * Uppercases the first letter of a text.
 */
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
