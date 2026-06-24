// Baut alle Pokemon-Karten als einen HTML-String zusammen.
function getPokemonCardsTemplate(pokemons) {
  return pokemons.map((pokemon) => getPokemonCardTemplate(pokemon)).join("");
}


// Baut das HTML für eine einzelne Pokemon-Karte.
function getPokemonCardTemplate(pokemon) {
  return `
    <button class="pokemon_card ${pokemon.types[0]}_card" data-id="card" type="button">
      <img class="pokemon_card_image" data-id="card-image" src="${pokemon.image}" alt="${pokemon.name}" />
      <span class="pokemon_number">No. ${pokemon.id}</span>
      <h2 class="pokemon_name">${pokemon.name}</h2>
      <span class="pokemon_types">${getPokemonTypesTemplate(pokemon.types)}</span>
    </button>
  `;
}


// Baut alle Typ-Badges für ein Pokemon.
function getPokemonTypesTemplate(types) {
  return types.map((type) => getPokemonTypeTemplate(type)).join("");
}


// Baut das HTML für einen einzelnen Typ-Badge.
function getPokemonTypeTemplate(type) {
  return `<span class="type_badge ${type}_type">${capitalizeFirstLetter(type)}</span>`;
}


// Baut die Meldung, wenn keine Pokemon gefunden wurden.
function getNotFoundTemplate(message) {
  return `<p class="not_found_message" data-id="not-found">${message}</p>`;
}
