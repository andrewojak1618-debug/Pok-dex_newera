// Reagiert auf Änderungen im Suchfeld.
function handleSearchInput() {
  updateSearchButtonState();
  const searchValue = getSearchValue();
  if (isValidSearchValue(searchValue)) return;
  if (searchValue.length > 0) return renderShortSearchMessage();
  if (!pokemonState.isSearchActive) return;
  resetSearchResult();
}


// Zeigt die Meldung für zu kurze Suchbegriffe.
function renderShortSearchMessage() {
  activateSearchMode();
  renderMessage("Please enter at least 3 letters.");
}


// Verarbeitet die Suche und prüft die Mindestlänge.
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


// Liest den aktuellen Suchbegriff aus dem Suchfeld.
function getSearchValue() {
  return getSearchInput().value.trim().toLowerCase();
}


// Holt die Suchfeld-Referenz aus dem DOM.
function getSearchInput() {
  return document.getElementById("pokemon_search");
}


// Prüft, ob der Suchbegriff lang genug ist.
function isValidSearchValue(searchValue) {
  return searchValue.length >= 3;
}


// Aktiviert den Search-Button ab drei Zeichen.
function updateSearchButtonState() {
  const searchButton = document.querySelector("[data-id='search-button']");
  searchButton.disabled =
    pokemonState.isLoading || !isValidSearchValue(getSearchValue());
}


// Schaltet die App in den Suchmodus.
function activateSearchMode() {
  pokemonState.isSearchActive = true;
  toggleLoadMoreButton(pokemonState.isLoading);
}


// Schaltet die App zurück in den Listenmodus.
function deactivateSearchMode() {
  pokemonState.isSearchActive = false;
  toggleLoadMoreButton(pokemonState.isLoading);
}


// Lädt alle passenden Pokemon und rendert die Suchergebnisse.
async function renderSearchResult(searchValue) {
  setLoadingState(true);
  try {
    await renderApiSearchResults(searchValue);
  } catch (error) {
    renderMessage("No match found.");
  } finally {
    setLoadingState(false);
  }
}


// Rendert gefundene Teiltreffer oder zeigt eine Meldung.
async function renderApiSearchResults(searchValue) {
  const pokemons = await fetchPokemonsBySearchValue(searchValue);
  pokemons.length ? renderFoundPokemons(pokemons) : renderMessage("No match found.");
}


// Rendert alle gefundenen Pokemon als Karten.
function renderFoundPokemons(pokemons) {
  renderPokemonGrid(pokemons);
}


// Stellt die bereits geladene Pokemon-Liste wieder her.
function resetSearchResult() {
  deactivateSearchMode();
  renderPokemonGrid(getRenderedPokemons());
}
