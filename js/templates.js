/**
 * Builds the HTML for one Pokemon card.
 */
function getPokemonCardTemplate(pokemon, typesTemplate) {
  return `
    <li class="pokemon_list_item">
      <button class="pokemon_card ${pokemon.types[0]}_card" data-id="card" data-pokemon-id="${pokemon.id}" type="button" aria-label="Open details for ${pokemon.name}">
        <img class="pokemon_card_image" data-id="card-image" src="${pokemon.image}" alt="${pokemon.name} official artwork" />
        <span class="pokemon_number">No. ${pokemon.id}</span>
        <h2 class="pokemon_name">${pokemon.name}</h2>
        <span class="pokemon_types">${typesTemplate}</span>
      </button>
    </li>
  `;
}


/**
 * Builds the HTML for one type badge.
 */
function getPokemonTypeTemplate(type, typeLabel) {
  return `<span class="type_badge ${type}_type">${typeLabel}</span>`;
}


/**
 * Builds the message for missing search results.
 */
function getNotFoundTemplate(message) {
  return `<li class="not_found_item"><p class="not_found_message" data-id="not-found" role="status" aria-live="polite">${message}</p></li>`;
}


/**
 * Builds the empty state for the detail panel.
 */
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


/**
 * Builds the placeholder image for the empty detail panel.
 */
function getEmptyDetailImageTemplate() {
  return `<span class="detail_empty_image_frame"><img class="detail_empty_image" src="./assets/gifs-icon/waiting_ball.gif" alt="Waiting for Pokemon selection" /></span>`;
}


/**
 * Builds the right detail panel for the last selected Pokemon.
 */
function getDetailPanelTemplate(pokemon, detailParts) {
  return `
    <article class="detail_panel_content ${pokemon.types[0]}_detail">
      ${getDetailPanelImageTemplate(pokemon)}
      ${detailParts.header}
      ${detailParts.profile}
      ${detailParts.evolution}
      ${detailParts.navigation}
    </article>
  `;
}


/**
 * Builds number, name, and types for the detail panel.
 */
function getDetailPanelHeaderTemplate(pokemon, typesTemplate) {
  return `
    <span class="detail_panel_number">No. ${pokemon.id}</span>
    <h2 class="detail_panel_name">${pokemon.name}</h2>
    <span class="pokemon_types">${typesTemplate}</span>
  `;
}


/**
 * Builds profile and stats for the detail panel.
 */
function getDetailPanelProfileTemplate(measuresTemplate, statsTemplate) {
  return `
    <h3 class="detail_panel_section_title">Profile</h3>
    ${measuresTemplate}
    <h3 class="detail_panel_section_title">Stats</h3>
    <div class="detail_panel_stats">${statsTemplate}</div>
  `;
}


/**
 * Builds the image for the detail panel.
 */
function getDetailPanelImageTemplate(pokemon) {
  return `<img class="detail_panel_image" src="${pokemon.image}" alt="${pokemon.name} official artwork" />`;
}


/**
 * Builds the evolution section for the detail panel.
 */
function getDetailEvolutionContentTemplate() {
  return `<section class="detail_panel_evolution" id="detail_panel_evolution_content">${getEvolutionLoadingTemplate()}</section>`;
}


/**
 * Builds the navigation for the detail panel.
 */
function getDetailNavigationTemplate() {
  return `<div class="detail_navigation"><button class="detail_arrow_button" type="button" aria-label="Show previous Pokemon">Previous</button><button class="detail_arrow_button" type="button" aria-label="Show next Pokemon">Next</button></div>`;
}


/**
 * Builds the content for the Pokemon dialog.
 */
function getPokemonDialogContentTemplate(pokemon, dialogParts) {
  return `
    ${getCloseDialogButtonTemplate()}
    ${getDialogImageTemplate(pokemon)}
    <span class="dialog_pokemon_number">No. ${pokemon.id}</span>
    <h2 class="dialog_pokemon_name">${pokemon.name}</h2>
    <span class="pokemon_types">${dialogParts.types}</span>
    ${dialogParts.profile}
    ${dialogParts.evolution}
    ${dialogParts.navigation}
  `;
}


/**
 * Builds profile and stats for the dialog.
 */
function getDialogProfileTemplate(measuresTemplate, statsTemplate) {
  return `
    <h3 class="dialog_section_title">Profile</h3>
    ${measuresTemplate}
    <h3 class="dialog_section_title">Stats</h3>
    <div class="dialog_stats">${statsTemplate}</div>
  `;
}


/**
 * Builds the close button for the dialog.
 */
function getCloseDialogButtonTemplate() {
  return `<button class="close_dialog_button" data-id="close-dialog-button" type="button" aria-label="Close Pokemon details" title="Close Pokemon details"></button>`;
}


/**
 * Builds the large Pokemon image for the dialog.
 */
function getDialogImageTemplate(pokemon) {
  return `<img class="dialog_pokemon_image" data-id="dialog-image" src="${pokemon.image}" alt="${pokemon.name} official artwork" />`;
}


/**
 * Builds height and weight for the dialog.
 */
function getPokemonMeasuresTemplate(heightTemplate, weightTemplate) {
  return `<div class="dialog_measures">${heightTemplate}${weightTemplate}</div>`;
}


/**
 * Builds one measurement value.
 */
function getMeasureTemplate(label, value) {
  return `<span class="dialog_measure"><b>${label}</b>${value}</span>`;
}


/**
 * Builds one stat value.
 */
function getPokemonStatTemplate(statLabel, statValue) {
  return `<span class="dialog_stat"><b>${statLabel}</b>${statValue}</span>`;
}


/**
 * Builds the evolution section for the dialog.
 */
function getEvolutionContentTemplate() {
  return `<section class="dialog_evolution" id="dialog_evolution_content">${getEvolutionLoadingTemplate()}</section>`;
}


/**
 * Builds the loading state for evolution data.
 */
function getEvolutionLoadingTemplate() {
  return `<p class="dialog_evolution_message">Loading evolution...</p>`;
}


/**
 * Builds the loaded evolution content for the dialog.
 */
function getLoadedEvolutionTemplate(evolutionItemsTemplate) {
  return `<h3>Evolution</h3><div class="dialog_evolution_list">${evolutionItemsTemplate}</div>`;
}


/**
 * Builds the error message for unavailable evolution data.
 */
function getEvolutionErrorTemplate() {
  return `<p class="dialog_evolution_message">Evolution unavailable.</p>`;
}


/**
 * Builds one evolution stage with an optional level.
 */
function getEvolutionItemTemplate(evolution, levelTemplate) {
  return `${levelTemplate}<span class="dialog_evolution_item"><img src="${evolution.image}" alt="${evolution.name} official artwork" /><b>${evolution.name}</b></span>`;
}


/**
 * Builds the level label between two evolution stages.
 */
function getEvolutionLevelTemplate(levelLabel) {
  return `<span class="dialog_evolution_level">Lv. ${levelLabel}</span>`;
}


/**
 * Builds the navigation for the dialog.
 */
function getDialogNavigationTemplate() {
  return `<div class="dialog_navigation"><button class="dialog_arrow_button" data-id="prev-button" type="button" aria-label="Show previous Pokemon">Previous</button><button class="dialog_arrow_button" data-id="next-button" type="button" aria-label="Show next Pokemon">Next</button></div>`;
}
