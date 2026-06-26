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

// Baut den leeren Zustand für das Detailpanel.
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

// Baut das Platzhalter-Bild für das leere Detailpanel.
function getEmptyDetailImageTemplate() {
  return `<span class="detail_empty_image_frame"><img class="detail_empty_image" src="./assets/gifs-icon/waiting_ball.gif" alt="" /></span>`;
}

// Baut das rechte Detailpanel für das zuletzt gewählte Pokemon.
function getDetailPanelTemplate(pokemon) {
  return `
    <article class="detail_panel_content ${pokemon.types[0]}_detail">
      ${getDetailPanelImageTemplate(pokemon)}
      <span class="detail_panel_number">No. ${pokemon.id}</span>
      <h2 class="detail_panel_name">${pokemon.name}</h2>
      <span class="pokemon_types">${getPokemonTypesTemplate(pokemon.types)}</span>
      ${getDetailPanelProfileTemplate(pokemon)}
      ${getDetailEvolutionContentTemplate()}
    </article>
  `;
}

// Baut Profil und Stats für das rechte Detailpanel.
function getDetailPanelProfileTemplate(pokemon) {
  return `
    <h3 class="detail_panel_section_title">Profile</h3>
    ${getPokemonMeasureTemplate(pokemon)}
    <h3 class="detail_panel_section_title">Stats</h3>
    <div class="detail_panel_stats">${getDetailStatsTemplate(pokemon.stats)}</div>
  `;
}

// Baut das Bild für das rechte Detailpanel.
function getDetailPanelImageTemplate(pokemon) {
  return `<img class="detail_panel_image" src="${pokemon.image}" alt="${pokemon.name}" />`;
}

// Baut die Evolution-Sektion für das rechte Detailpanel.
function getDetailEvolutionContentTemplate() {
  return `<section class="detail_panel_evolution" id="detail_panel_evolution_content">${getEvolutionLoadingTemplate()}</section>`;
}

// Baut die wichtigsten Stats für das Detailpanel.
function getDetailStatsTemplate(stats) {
  return stats.map((stat) => getPokemonStatTemplate(stat)).join("");
}

// Baut den Inhalt für den Pokemon-Dialog.
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

// Baut Profile und Stats für den Dialog.
function getDialogProfileTemplate(pokemon) {
  return `
    <h3 class="dialog_section_title">Profile</h3>
    ${getPokemonMeasureTemplate(pokemon)}
    <h3 class="dialog_section_title">Stats</h3>
    <div class="dialog_stats">${getPokemonStatsTemplate(pokemon.stats)}</div>
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

// Baut Height und Weight für den Dialog.
function getPokemonMeasureTemplate(pokemon) {
  return `<div class="dialog_measures">${getMeasureTemplate("Height", formatHeight(pokemon.height))}${getMeasureTemplate("Weight", formatWeight(pokemon.weight))}</div>`;
}

// Baut einen einzelnen Messwert für den Dialog.
function getMeasureTemplate(label, value) {
  return `<span class="dialog_measure"><b>${label}</b>${value}</span>`;
}

// Baut alle Stat-Werte für den Dialog.
function getPokemonStatsTemplate(stats) {
  return stats.map((stat) => getPokemonStatTemplate(stat)).join("");
}

// Baut einen einzelnen Stat-Wert für den Dialog.
function getPokemonStatTemplate(stat) {
  return `<span class="dialog_stat"><b>${formatStatLabel(stat.name)}</b>${stat.value}</span>`;
}

// Kürzt API-Stat-Namen für kompakte Dialog-Pills.
function formatStatLabel(statName) {
  const statLabels = getStatLabels();
  return statLabels[statName] || statName;
}

// Sammelt die kurzen Labels für Pokemon-Stats.
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

// Formatiert die API-Höhe von Dezimeter zu Meter.
function formatHeight(height) {
  return `${(height / 10).toFixed(1)} m`;
}

// Formatiert das API-Gewicht von Hektogramm zu Kilogramm.
function formatWeight(weight) {
  return `${(weight / 10).toFixed(1)} kg`;
}

// Baut die Evolution-Sektion für den Dialog.
function getEvolutionContentTemplate() {
  return `<section class="dialog_evolution" id="dialog_evolution_content">${getEvolutionLoadingTemplate()}</section>`;
}

// Baut den Ladezustand für die Evolution.
function getEvolutionLoadingTemplate() {
  return `<p class="dialog_evolution_message">Loading evolution...</p>`;
}

// Baut den geladenen Evolution-Inhalt für den Dialog.
function getEvolutionTemplate(evolutions) {
  if (!evolutions.length) return getEvolutionErrorTemplate();
  return `<h3>Evolution</h3><div class="dialog_evolution_list">${getEvolutionItemsTemplate(evolutions)}</div>`;
}

// Baut die Fehlermeldung für nicht verfügbare Evolution.
function getEvolutionErrorTemplate() {
  return `<p class="dialog_evolution_message">Evolution unavailable.</p>`;
}

// Baut alle Evolution-Stufen für den Dialog.
function getEvolutionItemsTemplate(evolutions) {
  return evolutions
    .map((evolution, index) => {
      return getEvolutionItemTemplate(evolution, index);
    })
    .join("");
}

// Baut eine einzelne Evolution-Stufe mit optionalem Level.
function getEvolutionItemTemplate(evolution, index) {
  return `${getEvolutionLevelTemplate(evolution, index)}<span class="dialog_evolution_item"><img src="${evolution.image}" alt="${evolution.name}" /><b>${evolution.name}</b></span>`;
}

// Baut das Level zwischen zwei Evolution-Stufen.
function getEvolutionLevelTemplate(evolution, index) {
  if (index === 0) return "";
  return `<span class="dialog_evolution_level">Lv. ${evolution.level || "?"}</span>`;
}

// Baut die Navigation für den Dialog.
function getDialogNavigationTemplate() {
  return `<div class="dialog_navigation"><button class="dialog_arrow_button" data-id="prev-button" type="button">Previous</button><button class="dialog_arrow_button" data-id="next-button" type="button">Next</button></div>`;
}
