// Lädt ein einzelnes Pokemon oder nutzt es aus dem Cache.
async function fetchPokemonById(pokemonId) {
  if (pokemonState.pokemonCache[pokemonId]) {
    return pokemonState.pokemonCache[pokemonId];
  }

  const response = await fetch(`${pokemonState.baseUrl}/pokemon/${pokemonId}`);
  const pokemon = mapPokemonData(await response.json());
  pokemonState.pokemonCache[pokemonId] = pokemon;
  return pokemon;
}


// Lädt mehrere Pokemon anhand eines Startwertes und einer Menge.
async function fetchPokemonRange(startId, amount) {
  const pokemonIds = createPokemonIdList(startId, amount);
  const pokemonPromises = pokemonIds.map((pokemonId) => fetchPokemonById(pokemonId));
  return await Promise.all(pokemonPromises);
}


// Erstellt eine fortlaufende Liste von Pokemon-IDs.
function createPokemonIdList(startId, amount) {
  const pokemonIds = [];

  for (let count = 0; count < amount; count++) {
    pokemonIds.push(startId + count);
  }

  return pokemonIds;
}


// Kürzt die API-Daten auf die Werte, die unsere App braucht.
function mapPokemonData(pokemon) {
  return {
    id: pokemon.id,
    name: capitalizeFirstLetter(pokemon.name),
    image: pokemon.sprites.other["official-artwork"].front_default,
    types: pokemon.types.map((entry) => entry.type.name),
    stats: pokemon.stats.map((entry) => mapPokemonStat(entry)),
  };
}


// Kürzt einen Stat-Eintrag auf Name und Wert.
function mapPokemonStat(entry) {
  return {
    name: entry.stat.name,
    value: entry.base_stat,
  };
}


// Schreibt den ersten Buchstaben eines Textes groß.
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
