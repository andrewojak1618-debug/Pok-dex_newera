// Startet die App und lädt die ersten Pokemon.
async function initPokedex() {
  connectLoadMoreButton();
  connectSearchForm();
  connectPokemonGrid();
  connectPokemonDialog();
  renderEmptyDetailPanel();
  await loadInitialPokemon();
}

// Verbindet den Load-More-Button mit seiner Funktion.
function connectLoadMoreButton() {
  const loadMoreButton = document.getElementById("load_more_button");
  loadMoreButton.addEventListener("click", loadMorePokemon);
}

// Verbindet das Suchformular mit seiner Funktion.
function connectSearchForm() {
  const searchForm = document.querySelector(".search_bar");
  searchForm.addEventListener("submit", handleSearchSubmit);
  connectSearchInput();
  updateSearchButtonState();
}

// Verbindet das Suchfeld mit der Button-Aktivierung.
function connectSearchInput() {
  const searchInput = getSearchInput();
  searchInput.addEventListener("input", handleSearchInput);
}

// Verbindet das Pokemon-Grid mit dem Dialog.
function connectPokemonGrid() {
  const pokemonGrid = document.getElementById("pokemon_grid");
  pokemonGrid.addEventListener("click", handlePokemonCardClick);
}

// Verbindet den Dialog mit Hintergrundklick und Schließen-Event.
function connectPokemonDialog() {
  const pokemonDialog = document.getElementById("pokemon_dialog");
  pokemonDialog.addEventListener("click", handleDialogBackdropClick);
  pokemonDialog.addEventListener("close", unlockPageScroll);
}

// Lädt die erste Pokemon-Gruppe beim Start.
async function loadInitialPokemon() {
  await loadPokemonCards(pokemonState.initialAmount);
}

// Lädt die nächste Pokemon-Gruppe per Button.
async function loadMorePokemon() {
  await loadPokemonCards(pokemonState.loadAmount);
}

// Steuert Laden, Fehlerfall und Loading-Anzeige.
async function loadPokemonCards(amount) {
  if (pokemonState.isLoading) return;
  setLoadingState(true);
  try {
    await appendNextPokemonCards(amount);
  } catch (error) {
    renderMessage("Pokemon could not be loaded.");
  } finally {
    setLoadingState(false);
  }
}

// Lädt neue Pokemon und fügt sie an die Liste an.
async function appendNextPokemonCards(amount) {
  const pokemons = await fetchNextPokemons(amount);
  if (!pokemons.length) return;
  appendPokemonCards(pokemons);
  rememberRenderedPokemonIds(pokemons);
  updateVisiblePokemonIds(getRenderedPokemons());
}

// Holt die nächsten Pokemon anhand des aktuellen Startpunkts.
async function fetchNextPokemons(amount) {
  const startId = pokemonState.nextPokemonId;
  const loadAmount = getLimitedLoadAmount(amount);
  if (loadAmount === 0) return [];
  const pokemons = await fetchPokemonRange(startId, loadAmount);
  pokemonState.nextPokemonId += pokemons.length;
  return getNewPokemons(pokemons);
}

// Begrenzt die Lademenge auf die übrigen Pokemon.
function getLimitedLoadAmount(amount) {
  const remainingAmount = getRemainingPokemonAmount();
  return Math.min(amount, Math.max(remainingAmount, 0));
}

// Ermittelt, wie viele Pokemon noch geladen werden können.
function getRemainingPokemonAmount() {
  return pokemonState.maxPokemonId - pokemonState.nextPokemonId + 1;
}

// Filtert Pokemon heraus, die bereits gerendert wurden.
function getNewPokemons(pokemons) {
  return pokemons.filter((pokemon) => {
    return !pokemonState.renderedPokemonIds.includes(pokemon.id);
  });
}

// Merkt sich, welche Pokemon bereits gerendert wurden.
function rememberRenderedPokemonIds(pokemons) {
  for (let index = 0; index < pokemons.length; index++) {
    rememberRenderedPokemonId(pokemons[index].id);
  }
}

// Merkt sich eine Pokemon-ID ohne doppelte Einträge.
function rememberRenderedPokemonId(pokemonId) {
  if (pokemonState.renderedPokemonIds.includes(pokemonId)) return;
  pokemonState.renderedPokemonIds.push(pokemonId);
}

// Schaltet die App zwischen Lade-Modus und Normal-Modus um
// Speichert den Ladezustand und aktualisiert die UI.
function setLoadingState(isLoading) {
  pokemonState.isLoading = isLoading;
  toggleLoadingScreen(isLoading);
  toggleLoadMoreButton(isLoading);
  updateSearchButtonState();
}

// Zeigt oder versteckt den Loading-Screen.
function toggleLoadingScreen(isLoading) {
  const loadingScreen = document.getElementById("loading_screen");
  loadingScreen.classList.toggle("is_hidden", !isLoading);
}

// Aktiviert oder deaktiviert den Load-More-Button.
function toggleLoadMoreButton(isLoading) {
  const loadMoreButton = document.getElementById("load_more_button");
  loadMoreButton.disabled = isLoading || !hasMorePokemonToLoad();
  loadMoreButton.classList.toggle("is_hidden", isLoadMoreButtonHidden());
}

// Prüft, ob der Load-More-Button versteckt werden soll.
function isLoadMoreButtonHidden() {
  return pokemonState.isSearchActive || !hasMorePokemonToLoad();
}

// Prüft, ob weitere Pokemon geladen werden können.
function hasMorePokemonToLoad() {
  return pokemonState.nextPokemonId <= pokemonState.maxPokemonId;
}

window.addEventListener("DOMContentLoaded", initPokedex);
