// Fügt Pokemon-Karten in den vorhandenen Grid-Container ein.
function appendPokemonCards(pokemons) {
  const pokemonGrid = document.getElementById("pokemon_grid");
  pokemonGrid.innerHTML += getPokemonCardsTemplate(pokemons);
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
  document.getElementById("message_container").innerHTML = "";
  document.getElementById("pokemon_grid").innerHTML = getNotFoundTemplate(message);
  updateVisiblePokemonIds([]);
}


// Reagiert auf den Klick einer Pokemon-Karte.
function handlePokemonCardClick(event) {
  const pokemonCard = event.target.closest("[data-id='card']");
  if (!pokemonCard) return;
  openPokemonDetails(Number(pokemonCard.dataset.pokemonId));
}


// Lädt die Pokemon-Daten und öffnet die passende Ansicht.
async function openPokemonDetails(pokemonId) {
  const requestId = startDialogRequest();
  try {
    const pokemon = await fetchPokemonById(pokemonId);
    if (!isActiveDialogRequest(requestId)) return;
    showLoadedPokemonDetails(pokemon);
    endDialogRequest(requestId);
    await renderEvolutionSection(pokemon);
  } catch (error) {
    endDialogRequest(requestId);
    renderMessage("Pokemon details could not be loaded.");
  }
}


// Zeigt geladene Pokemon-Daten je nach Bildschirmgröße an.
function showLoadedPokemonDetails(pokemon) {
  pokemonState.activePokemonId = pokemon.id;
  renderLastSelectedPokemon(pokemon);
  if (isDesktopDetailMode()) return;
  renderPokemonDialog(pokemon);
  showPokemonDialog();
}


// Prüft, ob Desktop nur das Detailpanel nutzen soll.
function isDesktopDetailMode() {
  return window.matchMedia("(min-width: 1256px)").matches;
}


// Rendert den leeren Startzustand im Detailpanel.
function renderEmptyDetailPanel() {
  getDetailPanel().innerHTML = getEmptyDetailPanelTemplate();
}


// Rendert das zuletzt ausgewählte Pokemon im Detailpanel.
function renderLastSelectedPokemon(pokemon) {
  getDetailPanel().innerHTML = getDetailPanelTemplate(pokemon);
  connectDetailNavigationButtons();
}


// Holt das rechte Detailpanel aus dem DOM.
function getDetailPanel() {
  return document.querySelector(".pokemon_detail_panel");
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
    renderLoadedEvolution(evolutions);
  } catch (error) {
    if (isActivePokemon(pokemon.id)) renderEvolutionError();
  }
}


// Rendert geladene Evolutionen in Dialog und Detailpanel.
function renderLoadedEvolution(evolutions) {
  const template = getEvolutionTemplate(evolutions);
  updateEvolutionSection(template);
  updateDetailEvolutionSection(template);
}


// Rendert den Fehlerzustand für Evolutionen.
function renderEvolutionError() {
  const template = getEvolutionErrorTemplate();
  updateEvolutionSection(template);
  updateDetailEvolutionSection(template);
}


// Prüft, ob das geladene Pokemon noch aktiv ist.
function isActivePokemon(pokemonId) {
  return pokemonState.activePokemonId === pokemonId;
}


// Aktualisiert nur den Evolution-Bereich im Dialog.
function updateEvolutionSection(template) {
  const evolutionContent = document.getElementById("dialog_evolution_content");
  if (!evolutionContent) return;
  evolutionContent.innerHTML = template;
}


// Aktualisiert nur den Evolution-Bereich im Detailpanel.
function updateDetailEvolutionSection(template) {
  const evolutionContent = document.getElementById(
    "detail_panel_evolution_content",
  );
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
  togglePokemonNavigationButtons(false);
}


// Verbindet die Detailpanel-Buttons mit ihren Funktionen.
function connectDetailNavigationButtons() {
  const buttons = getDetailNavigationButtons();
  if (!buttons.length) return;
  buttons[0].addEventListener("click", showPreviousPokemon);
  buttons[1].addEventListener("click", showNextPokemon);
  togglePokemonNavigationButtons(false);
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
  togglePokemonNavigationButtons(isDisabled);
}


// Schaltet alle Pokemon-Navigationsbuttons passend zum Zustand.
function togglePokemonNavigationButtons(isDisabled) {
  const buttons = getDialogNavigationButtons();
  buttons.forEach((button) => {
    button.disabled = isDisabled || !hasDialogNavigation();
  });
}


// Holt alle Navigationsbuttons aus Dialog und Detailpanel.
function getDialogNavigationButtons() {
  return document.querySelectorAll(
    "[data-id='prev-button'], [data-id='next-button'], .detail_arrow_button",
  );
}


// Holt die Navigationsbuttons aus dem rechten Detailpanel.
function getDetailNavigationButtons() {
  return document.querySelectorAll(".detail_arrow_button");
}


// Prüft, ob mehr als ein sichtbares Pokemon navigierbar ist.
function hasDialogNavigation() {
  return pokemonState.visiblePokemonIds.length > 1;
}


// Zeigt das vorherige Pokemon im geöffneten Dialog.
function showPreviousPokemon() {
  if (pokemonState.isDialogLoading) return;
  const previousPokemonId = getPreviousPokemonId();
  openPokemonDetails(previousPokemonId);
}


// Zeigt das nächste Pokemon im geöffneten Dialog.
function showNextPokemon() {
  if (pokemonState.isDialogLoading) return;
  const nextPokemonId = getNextPokemonId();
  openPokemonDetails(nextPokemonId);
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
