/**
 * Builds all Pokemon card templates.
 */
function getPokemonCardsTemplate(pokemons) {
  return pokemons.map((pokemon) => getPokemonCardHtml(pokemon)).join("");
}


/**
 * Builds one Pokemon card with prepared type markup.
 */
function getPokemonCardHtml(pokemon) {
  const typesTemplate = getPokemonTypesTemplate(pokemon.types);
  return getPokemonCardTemplate(pokemon, typesTemplate);
}


/**
 * Builds all type badge templates.
 */
function getPokemonTypesTemplate(types) {
  return types.map((type) => getPokemonTypeHtml(type)).join("");
}


/**
 * Builds one type badge with a formatted label.
 */
function getPokemonTypeHtml(type) {
  return getPokemonTypeTemplate(type, capitalizeFirstLetter(type));
}


/**
 * Builds the detail panel with prepared markup.
 */
function getPreparedDetailPanelTemplate(pokemon) {
  return getDetailPanelTemplate(pokemon, getDetailPanelParts(pokemon));
}


/**
 * Collects prepared detail panel parts.
 */
function getDetailPanelParts(pokemon) {
  return {
    header: getDetailPanelHeaderHtml(pokemon),
    profile: getDetailPanelProfileHtml(pokemon),
    evolution: getDetailEvolutionContentTemplate(),
    navigation: getDetailNavigationTemplate(),
  };
}


/**
 * Builds number, name, and type markup for the detail panel.
 */
function getDetailPanelHeaderHtml(pokemon) {
  return getDetailPanelHeaderTemplate(
    pokemon,
    getPokemonTypesTemplate(pokemon.types),
  );
}


/**
 * Builds prepared profile markup for the detail panel.
 */
function getDetailPanelProfileHtml(pokemon) {
  const measuresTemplate = getPokemonMeasureTemplate(pokemon);
  const statsTemplate = getPokemonStatsTemplate(pokemon.stats);
  return getDetailPanelProfileTemplate(measuresTemplate, statsTemplate);
}


/**
 * Builds the dialog content with prepared markup.
 */
function getPreparedPokemonDialogContentTemplate(pokemon) {
  return getPokemonDialogContentTemplate(pokemon, getDialogParts(pokemon));
}


/**
 * Collects prepared dialog parts.
 */
function getDialogParts(pokemon) {
  return {
    types: getPokemonTypesTemplate(pokemon.types),
    profile: getDialogProfileHtml(pokemon),
    evolution: getEvolutionContentTemplate(),
    navigation: getDialogNavigationTemplate(),
  };
}


/**
 * Builds prepared profile markup for the dialog.
 */
function getDialogProfileHtml(pokemon) {
  const measuresTemplate = getPokemonMeasureTemplate(pokemon);
  const statsTemplate = getPokemonStatsTemplate(pokemon.stats);
  return getDialogProfileTemplate(measuresTemplate, statsTemplate);
}


/**
 * Builds height and weight markup with formatted values.
 */
function getPokemonMeasureTemplate(pokemon) {
  const heightTemplate = getMeasureTemplate("Height", formatHeight(pokemon.height));
  const weightTemplate = getMeasureTemplate("Weight", formatWeight(pokemon.weight));
  return getPokemonMeasuresTemplate(heightTemplate, weightTemplate);
}


/**
 * Builds all stat templates.
 */
function getPokemonStatsTemplate(stats) {
  return stats.map((stat) => getPokemonStatHtml(stat)).join("");
}


/**
 * Builds one stat template with a formatted label.
 */
function getPokemonStatHtml(stat) {
  return getPokemonStatTemplate(formatStatLabel(stat.name), stat.value);
}


/**
 * Shortens API stat names for compact stat pills.
 */
function formatStatLabel(statName) {
  return getStatLabels()[statName] || statName;
}


/**
 * Returns the short labels for Pokemon stats.
 */
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


/**
 * Formats the API height from decimeters to meters.
 */
function formatHeight(height) {
  return `${(height / 10).toFixed(1)} m`;
}


/**
 * Formats the API weight from hectograms to kilograms.
 */
function formatWeight(weight) {
  return `${(weight / 10).toFixed(1)} kg`;
}


/**
 * Builds the evolution section content.
 */
function getEvolutionTemplate(evolutions) {
  if (!evolutions.length) return getEvolutionErrorTemplate();
  return getLoadedEvolutionTemplate(getEvolutionItemsTemplate(evolutions));
}


/**
 * Builds all evolution stage templates.
 */
function getEvolutionItemsTemplate(evolutions) {
  return evolutions.map((evolution, index) => {
    return getEvolutionItemHtml(evolution, index);
  }).join("");
}


/**
 * Builds one evolution stage with prepared level markup.
 */
function getEvolutionItemHtml(evolution, index) {
  const levelTemplate = getEvolutionLevelHtml(evolution, index);
  return getEvolutionItemTemplate(evolution, levelTemplate);
}


/**
 * Builds optional level markup for one evolution stage.
 */
function getEvolutionLevelHtml(evolution, index) {
  if (index === 0) return "";
  return getEvolutionLevelTemplate(evolution.level || "?");
}
