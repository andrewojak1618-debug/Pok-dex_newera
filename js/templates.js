// Baut alle Pokemon-Karten als einen HTML-String zusammen.
function getPokemonCardsTemplate(pokemons) {
  return pokemons.map((pokemon) => getPokemonCardTemplate(pokemon)).join("");
}


// Baut das HTML für eine einzelne Pokemon-Karte.
function getPokemonCardTemplate(pokemon) {
  return `
    <button class="pokemon_card ${pokemon.types[0]}_card" data-id="card" data-pokemon-id="${pokemon.id}" type="button">
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


// Baut den Inhalt für den Pokemon-Dialog.
function getPokemonDialogContentTemplate(pokemon) {
  return `
    ${getCloseDialogButtonTemplate()}
    ${getDialogImageTemplate(pokemon)}
    <h2 class="dialog_pokemon_name">${pokemon.name}</h2>
    <span class="pokemon_types">${getPokemonTypesTemplate(pokemon.types)}</span>
    <div class="dialog_stats">${getPokemonStatsTemplate(pokemon.stats)}</div>
    ${getDialogNavigationTemplate()}
  `;
}


// Baut den Schließen-Button für den Dialog.
function getCloseDialogButtonTemplate() {
  return `<button class="close_dialog_button" data-id="close-dialog-button" type="button" aria-label="Close Pokemon details"></button>`;
}


// Baut das große Pokemon-Bild für den Dialog.
function getDialogImageTemplate(pokemon) {
  return `<img class="dialog_pokemon_image" data-id="dialog-image" src="${pokemon.image}" alt="${pokemon.name}" />`;
}


// Baut alle Stat-Werte für den Dialog.
function getPokemonStatsTemplate(stats) {
  return stats.map((stat) => getPokemonStatTemplate(stat)).join("");
}


// Baut einen einzelnen Stat-Wert für den Dialog.
function getPokemonStatTemplate(stat) {
  return `<span class="dialog_stat"><b>${formatStatName(stat.name)}</b>${stat.value}</span>`;
}


// Formatiert API-Stat-Namen lesbarer für die Oberfläche.
function formatStatName(statName) {
  return statName.split("-").map((word) => capitalizeFirstLetter(word)).join(" ");
}


// Baut die Navigation für den Dialog.
function getDialogNavigationTemplate() {
  return `<div class="dialog_navigation"><button class="dialog_arrow_button" data-id="prev-button" type="button">Previous</button><button class="dialog_arrow_button" data-id="next-button" type="button">Next</button></div>`;
}
