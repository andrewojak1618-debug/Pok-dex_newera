// Builds all Pokemon cards as one HTML string.
function getPokemonCardsTemplate(pokemons) {
  return pokemons.map((pokemon) => getPokemonCardTemplate(pokemon)).join("");
}

// Builds the HTML for one Pokemon card.
function getPokemonCardTemplate(pokemon) {
  return `
    <li class="pokemon_list_item">
      <button class="pokemon_card ${pokemon.types[0]}_card" data-id="card" data-pokemon-id="${pokemon.id}" type="button" aria-label="Open details for ${pokemon.name}">
        <img class="pokemon_card_image" data-id="card-image" src="${pokemon.image}" alt="${pokemon.name} official artwork" />
        <span class="pokemon_number">No. ${pokemon.id}</span>
        <h2 class="pokemon_name">${pokemon.name}</h2>
        <span class="pokemon_types">${getPokemonTypesTemplate(pokemon.types)}</span>
      </button>
    </li>
  `;
}

// Builds all type badges for one Pokemon.
function getPokemonTypesTemplate(types) {
  return types.map((type) => getPokemonTypeTemplate(type)).join("");
}

// Builds the HTML for one type badge.
function getPokemonTypeTemplate(type) {
  return `<span class="type_badge ${type}_type">${capitalizeFirstLetter(type)}</span>`;
}

// Builds the message for missing search results.
function getNotFoundTemplate(message) {
  return `<li class="not_found_item"><p class="not_found_message" data-id="not-found" role="status" aria-live="polite">${message}</p></li>`;
}

// Builds the empty state for the detail panel.
function getEmptyDetailPanelTemplate() {
  return `
    <article class="detail_empty_state">
      ${getEmptyDetailImageTemplate()}
      <span class="detail_panel_label">Last selected</span>
      <h2>Select a Pokemon</h2>
      <p>Your last opened Pokemon will stay visible here.</p>
    </article>
  `;
}

// Builds the placeholder image for the empty detail panel.
function getEmptyDetailImageTemplate() {
  return `<span class="detail_empty_image_frame"><img class="detail_empty_image" src="./assets/gifs-icon/waiting_ball.gif" alt="Waiting for Pokemon selection" /></span>`;
}

// Builds the right detail panel for the last selected Pokemon.
function getDetailPanelTemplate(pokemon) {
  return `
    <article class="detail_panel_content ${pokemon.types[0]}_detail">
      ${getDetailPanelImageTemplate(pokemon)}
      ${getDetailPanelHeaderTemplate(pokemon)}
      ${getDetailPanelProfileTemplate(pokemon)}
      ${getDetailEvolutionContentTemplate()}
      ${getDetailNavigationTemplate()}
    </article>
  `;
}

// Builds number, name, and types for the detail panel.
function getDetailPanelHeaderTemplate(pokemon) {
  return `
    <span class="detail_panel_number">No. ${pokemon.id}</span>
    <h2 class="detail_panel_name">${pokemon.name}</h2>
    <span class="pokemon_types">${getPokemonTypesTemplate(pokemon.types)}</span>
  `;
}

// Builds profile and stats for the detail panel.
function getDetailPanelProfileTemplate(pokemon) {
  return `
    <h3 class="detail_panel_section_title">Profile</h3>
    ${getPokemonMeasureTemplate(pokemon)}
    <h3 class="detail_panel_section_title">Stats</h3>
    <div class="detail_panel_stats">${getDetailStatsTemplate(pokemon.stats)}</div>
  `;
}

// Builds the image for the detail panel.
function getDetailPanelImageTemplate(pokemon) {
  return `<img class="detail_panel_image" src="${pokemon.image}" alt="${pokemon.name} official artwork" />`;
}

// Builds the evolution section for the detail panel.
function getDetailEvolutionContentTemplate() {
  return `<section class="detail_panel_evolution" id="detail_panel_evolution_content">${getEvolutionLoadingTemplate()}</section>`;
}

// Builds the most important stats for the detail panel.
function getDetailStatsTemplate(stats) {
  return stats.map((stat) => getPokemonStatTemplate(stat)).join("");
}

// Builds the navigation for the detail panel.
function getDetailNavigationTemplate() {
  return `<div class="detail_navigation"><button class="detail_arrow_button" type="button" aria-label="Show previous Pokemon">Previous</button><button class="detail_arrow_button" type="button" aria-label="Show next Pokemon">Next</button></div>`;
}

// Builds the content for the Pokemon dialog.
function getPokemonDialogContentTemplate(pokemon) {
  return `
    ${getCloseDialogButtonTemplate()}
    ${getDialogImageTemplate(pokemon)}
    <span class="dialog_pokemon_number">No. ${pokemon.id}</span>
    <h2 class="dialog_pokemon_name">${pokemon.name}</h2>
    <span class="pokemon_types">${getPokemonTypesTemplate(pokemon.types)}</span>
    ${getDialogProfileTemplate(pokemon)}
    ${getEvolutionContentTemplate()}
    ${getDialogNavigationTemplate()}
  `;
}

// Builds profile and stats for the dialog.
function getDialogProfileTemplate(pokemon) {
  return `
    <h3 class="dialog_section_title">Profile</h3>
    ${getPokemonMeasureTemplate(pokemon)}
    <h3 class="dialog_section_title">Stats</h3>
    <div class="dialog_stats">${getPokemonStatsTemplate(pokemon.stats)}</div>
  `;
}

// Builds the close button for the dialog.
function getCloseDialogButtonTemplate() {
  return `<button class="close_dialog_button" data-id="close-dialog-button" type="button" aria-label="Close Pokemon details" title="Close Pokemon details"></button>`;
}

// Builds the large Pokemon image for the dialog.
function getDialogImageTemplate(pokemon) {
  return `<img class="dialog_pokemon_image" data-id="dialog-image" src="${pokemon.image}" alt="${pokemon.name} official artwork" />`;
}

// Builds height and weight for the dialog.
function getPokemonMeasureTemplate(pokemon) {
  return `<div class="dialog_measures">${getMeasureTemplate("Height", formatHeight(pokemon.height))}${getMeasureTemplate("Weight", formatWeight(pokemon.weight))}</div>`;
}

// Builds one measurement value.
function getMeasureTemplate(label, value) {
  return `<span class="dialog_measure"><b>${label}</b>${value}</span>`;
}

// Builds all stat values for the dialog.
function getPokemonStatsTemplate(stats) {
  return stats.map((stat) => getPokemonStatTemplate(stat)).join("");
}

// Builds one stat value.
function getPokemonStatTemplate(stat) {
  return `<span class="dialog_stat"><b>${formatStatLabel(stat.name)}</b>${stat.value}</span>`;
}

// Shortens API stat names for compact stat pills.
function formatStatLabel(statName) {
  const statLabels = getStatLabels();
  return statLabels[statName] || statName;
}

// Returns the short labels for Pokemon stats.
function getStatLabels() {
  return {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SpA",
    "special-defense": "SpD",
    speed: "SPD",
  };
}

// Formats the API height from decimeters to meters.
function formatHeight(height) {
  return `${(height / 10).toFixed(1)} m`;
}

// Formats the API weight from hectograms to kilograms.
function formatWeight(weight) {
  return `${(weight / 10).toFixed(1)} kg`;
}

// Builds the evolution section for the dialog.
function getEvolutionContentTemplate() {
  return `<section class="dialog_evolution" id="dialog_evolution_content">${getEvolutionLoadingTemplate()}</section>`;
}

// Builds the loading state for evolution data.
function getEvolutionLoadingTemplate() {
  return `<p class="dialog_evolution_message">Loading evolution...</p>`;
}

// Builds the loaded evolution content for the dialog.
function getEvolutionTemplate(evolutions) {
  if (!evolutions.length) return getEvolutionErrorTemplate();
  return `<h3>Evolution</h3><div class="dialog_evolution_list">${getEvolutionItemsTemplate(evolutions)}</div>`;
}

// Builds the error message for unavailable evolution data.
function getEvolutionErrorTemplate() {
  return `<p class="dialog_evolution_message">Evolution unavailable.</p>`;
}

// Builds all evolution stages for the dialog.
function getEvolutionItemsTemplate(evolutions) {
  return evolutions
    .map((evolution, index) => {
      return getEvolutionItemTemplate(evolution, index);
    })
    .join("");
}

// Builds one evolution stage with an optional level.
function getEvolutionItemTemplate(evolution, index) {
  return `${getEvolutionLevelTemplate(evolution, index)}<span class="dialog_evolution_item"><img src="${evolution.image}" alt="${evolution.name} official artwork" /><b>${evolution.name}</b></span>`;
}

// Builds the level label between two evolution stages.
function getEvolutionLevelTemplate(evolution, index) {
  if (index === 0) return "";
  return `<span class="dialog_evolution_level">Lv. ${evolution.level || "?"}</span>`;
}

// Builds the navigation for the dialog.
function getDialogNavigationTemplate() {
  return `<div class="dialog_navigation"><button class="dialog_arrow_button" data-id="prev-button" type="button" aria-label="Show previous Pokemon">Previous</button><button class="dialog_arrow_button" data-id="next-button" type="button" aria-label="Show next Pokemon">Next</button></div>`;
}
