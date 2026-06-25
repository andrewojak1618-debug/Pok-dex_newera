// Startet die App und lädt die ersten Pokemon.
async function initPokedex() {
  connectLoadMoreButton();
  connectSearchForm();
  connectPokemonGrid();
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
}


// Verbindet das Pokemon-Grid mit dem Dialog.
function connectPokemonGrid() {
  const pokemonGrid = document.getElementById("pokemon_grid");
  pokemonGrid.addEventListener("click", handlePokemonCardClick);
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
  appendPokemonCards(pokemons);
  rememberRenderedPokemonIds(pokemons);
}


// Holt die nächsten Pokemon anhand des aktuellen Startpunkts.
async function fetchNextPokemons(amount) {
  const startId = pokemonState.nextPokemonId;
  const pokemons = await fetchPokemonRange(startId, amount);
  pokemonState.nextPokemonId += pokemons.length;
  return pokemons;
}


// Fügt Pokemon-Karten in den vorhandenen Grid-Container ein.
function appendPokemonCards(pokemons) {
  const pokemonGrid = document.getElementById("pokemon_grid");
  pokemonGrid.innerHTML += getPokemonCardsTemplate(pokemons);
}


// Merkt sich, welche Pokemon bereits gerendert wurden.
function rememberRenderedPokemonIds(pokemons) {
  for (let index = 0; index < pokemons.length; index++) {
    pokemonState.renderedPokemonIds.push(pokemons[index].id);
  }
}


// Speichert den Ladezustand und aktualisiert die UI.
function setLoadingState(isLoading) {
  pokemonState.isLoading = isLoading;
  toggleLoadingScreen(isLoading);
  toggleLoadMoreButton(isLoading);
}


// Zeigt oder versteckt den Loading-Screen.
function toggleLoadingScreen(isLoading) {
  const loadingScreen = document.getElementById("loading_screen");
  loadingScreen.classList.toggle("is_hidden", !isLoading);
}


// Aktiviert oder deaktiviert den Load-More-Button.
function toggleLoadMoreButton(isLoading) {
  const loadMoreButton = document.getElementById("load_more_button");
  loadMoreButton.disabled = isLoading;
}


// Verarbeitet die Suche und prüft die Mindestlänge.
function handleSearchSubmit(event) {
  event.preventDefault();
  const searchValue = getSearchValue();

  if (searchValue.length < 3) {
    renderMessage("Please enter at least 3 letters.");
    return;
  }

  renderSearchResult(searchValue);
}


// Liest den aktuellen Suchbegriff aus dem Suchfeld.
function getSearchValue() {
  const searchInput = document.getElementById("pokemon_search");
  return searchInput.value.trim().toLowerCase();
}


// Filtert die bereits geladenen Pokemon nach dem Suchbegriff.
function renderSearchResult(searchValue) {
  const pokemons = getRenderedPokemons();
  const matches = pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(searchValue));
  matches.length ? renderPokemonGrid(matches) : renderMessage("No match found.");
}


// Holt alle aktuell gerenderten Pokemon aus dem Cache.
function getRenderedPokemons() {
  return pokemonState.renderedPokemonIds.map((pokemonId) => {
    return pokemonState.pokemonCache[pokemonId];
  });
}


// Ersetzt den Grid-Inhalt durch eine neue Pokemon-Liste.
function renderPokemonGrid(pokemons) {
  document.getElementById("message_container").innerHTML = "";
  document.getElementById("pokemon_grid").innerHTML = getPokemonCardsTemplate(pokemons);
}


// Zeigt eine Meldung und leert den Kartenbereich.
function renderMessage(message) {
  document.getElementById("pokemon_grid").innerHTML = "";
  document.getElementById("message_container").innerHTML = getNotFoundTemplate(message);
}


// Reagiert auf den Klick einer Pokemon-Karte.
function handlePokemonCardClick(event) {
  const pokemonCard = event.target.closest("[data-id='card']");
  if (!pokemonCard) return;
  openPokemonDialog(Number(pokemonCard.dataset.pokemonId));
}


// Lädt die Dialog-Daten und öffnet den Dialog.
async function openPokemonDialog(pokemonId) {
  try {
    const pokemon = await fetchPokemonById(pokemonId);
    pokemonState.activePokemonId = pokemon.id;
    renderPokemonDialog(pokemon);
    showPokemonDialog();
  } catch (error) {
    renderMessage("Pokemon details could not be loaded.");
  }
}


// Rendert die echten Pokemon-Daten in den Dialog.
function renderPokemonDialog(pokemon) {
  const dialogContent = document.querySelector("[data-id='overlay-pokemon-name']");
  dialogContent.innerHTML = getPokemonDialogContentTemplate(pokemon);
  connectDialogCloseButton();
}


// Öffnet den nativen Pokemon-Dialog.
function showPokemonDialog() {
  const pokemonDialog = document.getElementById("pokemon_dialog");
  pokemonDialog.showModal();
}


// Verbindet den Schließen-Button mit dem Dialog.
function connectDialogCloseButton() {
  const closeButton = document.querySelector("[data-id='close-dialog-button']");
  closeButton.addEventListener("click", closePokemonDialog);
}


// Schließt den nativen Pokemon-Dialog.
function closePokemonDialog() {
  document.getElementById("pokemon_dialog").close();
}


window.addEventListener("DOMContentLoaded", initPokedex);
