/**
 * Starts the app and loads the first Pokemon.
 */
async function initPokedex() {
  connectLoadMoreButton();
  connectSearchForm();
  connectPokemonGrid();
  connectPokemonDialog();
  renderEmptyDetailPanel();
  await loadInitialPokemon();
}


/**
 * Connects the Load More button with its action.
 */
function connectLoadMoreButton() {
  const loadMoreButton = document.getElementById("load_more_button");
  loadMoreButton.addEventListener("click", loadMorePokemon);
}


/**
 * Connects the search form with its action.
 */
function connectSearchForm() {
  const searchForm = document.querySelector(".search_bar");
  searchForm.addEventListener("submit", handleSearchSubmit);
  connectSearchInput();
  updateSearchButtonState();
}


/**
 * Connects the search input with live search updates.
 */
function connectSearchInput() {
  const searchInput = getSearchInput();
  searchInput.addEventListener("input", handleSearchInput);
  searchInput.addEventListener("search", handleSearchInput);
  connectSearchClearButton();
}


/**
 * Connects the clear search button with its action.
 */
function connectSearchClearButton() {
  const clearButton = getClearSearchButton();
  clearButton.addEventListener("click", clearSearchInput);
}


/**
 * Connects the Pokemon grid with the detail view.
 */
function connectPokemonGrid() {
  const pokemonGrid = document.getElementById("pokemon_grid");
  pokemonGrid.addEventListener("click", handlePokemonCardClick);
}


/**
 * Connects the dialog with backdrop and close events.
 */
function connectPokemonDialog() {
  const pokemonDialog = document.getElementById("pokemon_dialog");
  pokemonDialog.addEventListener("click", handleDialogBackdropClick);
  pokemonDialog.addEventListener("close", unlockPageScroll);
}


/**
 * Loads the first Pokemon group on startup.
 */
async function loadInitialPokemon() {
  await loadPokemonCards(pokemonState.initialAmount);
}


/**
 * Loads the next Pokemon group from the button.
 */
async function loadMorePokemon() {
  await loadPokemonCards(pokemonState.loadAmount);
}


/**
 * Controls loading, error handling, and feedback UI.
 */
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


/**
 * Loads new Pokemon and appends them to the list.
 */
async function appendNextPokemonCards(amount) {
  const pokemons = await fetchNextPokemons(amount);
  if (!pokemons.length) return;
  appendPokemonCards(pokemons);
  rememberRenderedPokemonIds(pokemons);
  updateVisiblePokemonIds(getRenderedPokemons());
}


/**
 * Gets the next Pokemon from the current start point.
 */
async function fetchNextPokemons(amount) {
  const startId = pokemonState.nextPokemonId;
  const loadAmount = getLimitedLoadAmount(amount);
  if (loadAmount === 0) return [];
  const pokemons = await fetchPokemonRange(startId, loadAmount);
  pokemonState.nextPokemonId += pokemons.length;
  return getNewPokemons(pokemons);
}


/**
 * Limits the load amount to the remaining Pokemon.
 */
function getLimitedLoadAmount(amount) {
  const remainingAmount = getRemainingPokemonAmount();
  return Math.min(amount, Math.max(remainingAmount, 0));
}


/**
 * Calculates how many Pokemon can still be loaded.
 */
function getRemainingPokemonAmount() {
  return pokemonState.maxPokemonId - pokemonState.nextPokemonId + 1;
}


/**
 * Filters out Pokemon that are already rendered.
 */
function getNewPokemons(pokemons) {
  return pokemons.filter((pokemon) => {
    return !pokemonState.renderedPokemonIds.includes(pokemon.id);
  });
}


/**
 * Stores all rendered Pokemon IDs.
 */
function rememberRenderedPokemonIds(pokemons) {
  for (let index = 0; index < pokemons.length; index++) {
    rememberRenderedPokemonId(pokemons[index].id);
  }
}


/**
 * Stores one Pokemon ID without duplicates.
 */
function rememberRenderedPokemonId(pokemonId) {
  if (pokemonState.renderedPokemonIds.includes(pokemonId)) return;
  pokemonState.renderedPokemonIds.push(pokemonId);
}


/**
 * Stores the loading state and updates the UI.
 */
function setLoadingState(isLoading) {
  pokemonState.isLoading = isLoading;
  toggleLoadingScreen(isLoading);
  toggleLoadMoreButton(isLoading);
  updateSearchButtonState();
}


/**
 * Shows or hides the loading screen.
 */
function toggleLoadingScreen(isLoading) {
  const loadingScreen = document.getElementById("loading_screen");
  loadingScreen.classList.toggle("is_hidden", !isLoading);
}


/**
 * Enables or disables the Load More button.
 */
function toggleLoadMoreButton(isLoading) {
  const loadMoreButton = document.getElementById("load_more_button");
  loadMoreButton.disabled = isLoading || !hasMorePokemonToLoad();
  loadMoreButton.classList.toggle("is_hidden", isLoadMoreButtonHidden());
}


/**
 * Checks if the Load More button should be hidden.
 */
function isLoadMoreButtonHidden() {
  return pokemonState.isSearchActive || !hasMorePokemonToLoad();
}


/**
 * Checks if more Pokemon can be loaded.
 */
function hasMorePokemonToLoad() {
  return pokemonState.nextPokemonId <= pokemonState.maxPokemonId;
}


window.addEventListener("DOMContentLoaded", initPokedex);
