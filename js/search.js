/**
 * Handles changes in the search input.
 */
function handleSearchInput() {
  updateSearchButtonState();
  const searchValue = getSearchValue();
  if (isValidSearchValue(searchValue)) return renderLiveSearch(searchValue);
  if (searchValue.length > 0) return renderShortSearchMessage();
  resetSearchAndDetailPanel();
}


/**
 * Shows the message for short search values.
 */
function renderShortSearchMessage() {
  activateSearchMode();
  renderMessage("Please enter at least 3 letters.");
}


/**
 * Starts the search automatically from three letters.
 */
async function renderLiveSearch(searchValue) {
  activateSearchMode();
  await renderSearchResult(searchValue);
}


/**
 * Handles form search and checks the minimum length.
 */
async function handleSearchSubmit(event) {
  event.preventDefault();
  const searchValue = getSearchValue();

  if (!isValidSearchValue(searchValue)) {
    renderMessage("Please enter at least 3 letters.");
    return;
  }

  activateSearchMode();
  await renderSearchResult(searchValue);
}


/**
 * Reads the current search value from the input.
 */
function getSearchValue() {
  return getSearchInput().value.trim().toLowerCase();
}


/**
 * Gets the search input reference from the DOM.
 */
function getSearchInput() {
  return document.getElementById("pokemon_search");
}


/**
 * Gets the clear search button reference from the DOM.
 */
function getClearSearchButton() {
  return document.getElementById("clear_search_button");
}


/**
 * Checks if the search value is long enough.
 */
function isValidSearchValue(searchValue) {
  return searchValue.length >= 3;
}


/**
 * Enables the search button from three letters.
 */
function updateSearchButtonState() {
  const searchButton = document.querySelector("[data-id='search-button']");
  searchButton.disabled =
    pokemonState.isLoading || !isValidSearchValue(getSearchValue());
  updateClearSearchButtonState();
}


/**
 * Shows the clear button when the search input has text.
 */
function updateClearSearchButtonState() {
  const clearButton = getClearSearchButton();
  clearButton.classList.toggle("is_hidden", getSearchValue().length === 0);
}


/**
 * Clears the search input and restores the default view.
 */
function clearSearchInput() {
  const searchInput = getSearchInput();
  searchInput.value = "";
  handleSearchInput();
  searchInput.focus();
}


/**
 * Switches the app into search mode.
 */
function activateSearchMode() {
  pokemonState.isSearchActive = true;
  toggleLoadMoreButton(pokemonState.isLoading);
}


/**
 * Switches the app back into list mode.
 */
function deactivateSearchMode() {
  pokemonState.isSearchActive = false;
  toggleLoadMoreButton(pokemonState.isLoading);
}


/**
 * Loads matching Pokemon and renders the search results.
 */
async function renderSearchResult(searchValue) {
  setLoadingState(true);
  try {
    await renderApiSearchResults(searchValue);
  } catch (error) {
    if (getSearchValue() === searchValue) renderMessage("No match found.");
  } finally {
    setLoadingState(false);
  }
}


/**
 * Renders partial matches or shows a message.
 */
async function renderApiSearchResults(searchValue) {
  const pokemons = await fetchPokemonsBySearchValue(searchValue);
  if (getSearchValue() !== searchValue) return;
  pokemons.length ? renderFoundPokemons(pokemons) : renderMessage("No match found.");
}


/**
 * Renders all found Pokemon as cards.
 */
function renderFoundPokemons(pokemons) {
  renderPokemonGrid(pokemons);
}


/**
 * Restores the already loaded Pokemon list.
 */
function resetSearchResult() {
  deactivateSearchMode();
  renderPokemonGrid(getRenderedPokemons());
}


/**
 * Clears search and resets the right detail panel.
 */
function resetSearchAndDetailPanel() {
  resetSearchResult();
  pokemonState.activePokemonId = null;
  renderEmptyDetailPanel();
}
