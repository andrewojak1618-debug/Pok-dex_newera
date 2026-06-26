// Startet die App und lädt die ersten Pokemon.
async function initPokedex() {
  connectLoadMoreButton();
  connectSearchForm();
  connectPokemonGrid();
  connectPokemonDialog();
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

// Reagiert auf Änderungen im Suchfeld.
function handleSearchInput() {
  updateSearchButtonState();
  if (isValidSearchValue(getSearchValue())) return;
  if (!pokemonState.isSearchActive) return;
  resetSearchResult();
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

// Fügt Pokemon-Karten in den vorhandenen Grid-Container ein.
function appendPokemonCards(pokemons) {
  const pokemonGrid = document.getElementById("pokemon_grid");
  pokemonGrid.innerHTML += getPokemonCardsTemplate(pokemons);
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

// Lädt ein Pokemon per API-Suche und rendert das Ergebnis.
async function renderSearchResult(searchValue) {
  setLoadingState(true);
  try {
    await renderApiSearchResult(searchValue);
  } catch (error) {
    renderMessage("No match found.");
  } finally {
    setLoadingState(false);
  }
}

// Rendert ein gefundenes Pokemon oder zeigt eine Meldung.
async function renderApiSearchResult(searchValue) {
  const pokemon = await fetchPokemonByName(searchValue);
  pokemon ? renderFoundPokemon(pokemon) : renderMessage("No match found.");
}

// Rendert ein einzelnes gefundenes Pokemon als Karte.
function renderFoundPokemon(pokemon) {
  renderPokemonGrid([pokemon]);
}

// Stellt die bereits geladene Pokemon-Liste wieder her.
function resetSearchResult() {
  deactivateSearchMode();
  renderPokemonGrid(getRenderedPokemons());
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
  document.getElementById("pokemon_grid").innerHTML =
    getPokemonCardsTemplate(pokemons);
  updateVisiblePokemonIds(pokemons);
}

// Speichert die aktuell sichtbaren Pokemon-IDs für den Dialog.
function updateVisiblePokemonIds(pokemons) {
  pokemonState.visiblePokemonIds = pokemons.map((pokemon) => pokemon.id);
}

// Zeigt eine Meldung und leert den Kartenbereich.
function renderMessage(message) {
  document.getElementById("pokemon_grid").innerHTML = "";
  document.getElementById("message_container").innerHTML =
    getNotFoundTemplate(message);
  updateVisiblePokemonIds([]);
}

// Reagiert auf den Klick einer Pokemon-Karte.
function handlePokemonCardClick(event) {
  const pokemonCard = event.target.closest("[data-id='card']");
  if (!pokemonCard) return;
  openPokemonDialog(Number(pokemonCard.dataset.pokemonId));
}

// Lädt die Dialog-Daten und öffnet den Dialog.
async function openPokemonDialog(pokemonId) {
  const requestId = startDialogRequest();
  try {
    const pokemon = await fetchPokemonById(pokemonId);
    if (!isActiveDialogRequest(requestId)) return;
    showLoadedPokemonDialog(pokemon);
    endDialogRequest(requestId);
    await renderEvolutionSection(pokemon);
  } catch (error) {
    endDialogRequest(requestId);
    renderMessage("Pokemon details could not be loaded.");
  }
}

// Zeigt die geladenen Pokemon-Daten im Dialog an.
function showLoadedPokemonDialog(pokemon) {
  pokemonState.activePokemonId = pokemon.id;
  renderPokemonDialog(pokemon);
  showPokemonDialog();
}

// Startet einen geschützten Dialog-Ladevorgang.
function startDialogRequest() {
  pokemonState.isDialogLoading = true;
  pokemonState.dialogRequestId += 1;
  toggleDialogNavigationButtons(true);
  return pokemonState.dialogRequestId;
}

// Beendet den aktuellen Dialog-Ladevorgang.
function endDialogRequest(requestId) {
  if (!isActiveDialogRequest(requestId)) return;
  pokemonState.isDialogLoading = false;
  toggleDialogNavigationButtons(false);
}

// Prüft, ob die Dialog-Antwort noch aktuell ist.
function isActiveDialogRequest(requestId) {
  return pokemonState.dialogRequestId === requestId;
}

// Lädt und rendert die Evolution im geöffneten Dialog.
async function renderEvolutionSection(pokemon) {
  try {
    const evolutions = await fetchEvolutionChain(pokemon);
    if (!isActivePokemon(pokemon.id)) return;
    updateEvolutionSection(getEvolutionTemplate(evolutions));
  } catch (error) {
    if (isActivePokemon(pokemon.id)) {
      updateEvolutionSection(getEvolutionErrorTemplate());
    }
  }
}

// Prüft, ob das geladene Pokemon noch im Dialog aktiv ist.
function isActivePokemon(pokemonId) {
  return pokemonState.activePokemonId === pokemonId;
}

// Aktualisiert nur den Evolution-Bereich im Dialog.
function updateEvolutionSection(template) {
  const evolutionContent = document.getElementById("dialog_evolution_content");
  if (!evolutionContent) return;
  evolutionContent.innerHTML = template;
}

// Rendert die echten Pokemon-Daten in den Dialog.
function renderPokemonDialog(pokemon) {
  const dialogContent = document.querySelector(
    "[data-id='overlay-pokemon-name']",
  );
  dialogContent.innerHTML = getPokemonDialogContentTemplate(pokemon);
  connectDialogButtons();
}

// Öffnet den nativen Pokemon-Dialog.
function showPokemonDialog() {
  const pokemonDialog = document.getElementById("pokemon_dialog");
  if (pokemonDialog.open) return;
  lockPageScroll();
  pokemonDialog.showModal();
}

// Verbindet die Dialog-Buttons mit ihren Funktionen.
function connectDialogButtons() {
  connectDialogCloseButton();
  connectPreviousButton();
  connectNextButton();
  toggleDialogNavigationButtons(false);
}

// Verbindet den Schließen-Button mit dem Dialog.
function connectDialogCloseButton() {
  const closeButton = document.querySelector("[data-id='close-dialog-button']");
  closeButton.addEventListener("click", closePokemonDialog);
}

// Verbindet den Previous-Button mit dem vorherigen Pokemon.
function connectPreviousButton() {
  const previousButton = document.querySelector("[data-id='prev-button']");
  previousButton.addEventListener("click", showPreviousPokemon);
}

// Verbindet den Next-Button mit dem nächsten Pokemon.
function connectNextButton() {
  const nextButton = document.querySelector("[data-id='next-button']");
  nextButton.addEventListener("click", showNextPokemon);
}

// Schaltet die Dialog-Navigation passend zum Zustand.
function toggleDialogNavigationButtons(isDisabled) {
  const buttons = getDialogNavigationButtons();
  buttons.forEach((button) => {
    button.disabled = isDisabled || !hasDialogNavigation();
  });
}

// Holt die Navigationsbuttons im geöffneten Dialog.
function getDialogNavigationButtons() {
  return document.querySelectorAll(
    "[data-id='prev-button'], [data-id='next-button']",
  );
}

// Prüft, ob mehr als ein sichtbares Pokemon navigierbar ist.
function hasDialogNavigation() {
  return pokemonState.visiblePokemonIds.length > 1;
}

// Zeigt das vorherige Pokemon im geöffneten Dialog.
function showPreviousPokemon() {
  if (pokemonState.isDialogLoading) return;
  const previousPokemonId = getPreviousPokemonId();
  openPokemonDialog(previousPokemonId);
}

// Zeigt das nächste Pokemon im geöffneten Dialog.
function showNextPokemon() {
  if (pokemonState.isDialogLoading) return;
  const nextPokemonId = getNextPokemonId();
  openPokemonDialog(nextPokemonId);
}

// Holt die ID des vorherigen gerenderten Pokemon.
function getPreviousPokemonId() {
  const currentIndex = getActivePokemonIndex();
  const lastIndex = pokemonState.visiblePokemonIds.length - 1;
  return (
    pokemonState.visiblePokemonIds[currentIndex - 1] ||
    pokemonState.visiblePokemonIds[lastIndex]
  );
}

// Holt die ID des nächsten gerenderten Pokemon.
function getNextPokemonId() {
  const currentIndex = getActivePokemonIndex();
  return (
    pokemonState.visiblePokemonIds[currentIndex + 1] ||
    pokemonState.visiblePokemonIds[0]
  );
}

// Holt die Position des aktuell geöffneten Pokemon.
function getActivePokemonIndex() {
  return pokemonState.visiblePokemonIds.indexOf(pokemonState.activePokemonId);
}

// Schließt den nativen Pokemon-Dialog.
function closePokemonDialog() {
  const pokemonDialog = document.getElementById("pokemon_dialog");
  if (!pokemonDialog.open) return;
  pokemonDialog.close();
  unlockPageScroll();
}

// Schließt den Dialog, wenn der Hintergrund angeklickt wird.
function handleDialogBackdropClick(event) {
  if (event.target !== event.currentTarget) return;
  closePokemonDialog();
}

// Fixiert die Seite an der aktuellen Scrollposition.
function lockPageScroll() {
  pokemonState.scrollPosition = window.scrollY;
  document.body.style.top = `-${pokemonState.scrollPosition}px`;
  document.body.classList.add("dialog_is_open");
}

// Löst die Scroll-Fixierung und stellt die Position wieder her.
function unlockPageScroll() {
  document.body.classList.remove("dialog_is_open");
  document.body.style.top = "";
  window.scrollTo(0, pokemonState.scrollPosition);
}

window.addEventListener("DOMContentLoaded", initPokedex);
