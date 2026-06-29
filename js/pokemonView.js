// Adds Pokemon cards to the existing grid container.
function appendPokemonCards(pokemons) {
  const pokemonGrid = document.getElementById("pokemon_grid");
  pokemonGrid.innerHTML += getPokemonCardsTemplate(pokemons);
}


// Gets all currently rendered Pokemon from the cache.
function getRenderedPokemons() {
  return pokemonState.renderedPokemonIds.map((pokemonId) => {
    return pokemonState.pokemonCache[pokemonId];
  });
}


// Replaces the grid content with a new Pokemon list.
function renderPokemonGrid(pokemons) {
  document.getElementById("message_container").innerHTML = "";
  document.getElementById("pokemon_grid").innerHTML =
    getPokemonCardsTemplate(pokemons);
  updateVisiblePokemonIds(pokemons);
}


// Stores the currently visible Pokemon IDs for navigation.
function updateVisiblePokemonIds(pokemons) {
  pokemonState.visiblePokemonIds = pokemons.map((pokemon) => pokemon.id);
}


// Shows a message and clears the card area.
function renderMessage(message) {
  document.getElementById("message_container").innerHTML = "";
  document.getElementById("pokemon_grid").innerHTML = getNotFoundTemplate(message);
  updateVisiblePokemonIds([]);
}


// Handles clicks on Pokemon cards.
function handlePokemonCardClick(event) {
  const pokemonCard = event.target.closest("[data-id='card']");
  if (!pokemonCard) return;
  openPokemonDetails(Number(pokemonCard.dataset.pokemonId));
}


// Loads Pokemon data and opens the matching detail view.
async function openPokemonDetails(pokemonId) {
  const requestId = startDialogRequest();
  try {
    const pokemon = await fetchPokemonById(pokemonId);
    if (!isActiveDialogRequest(requestId)) return;
    await renderLoadedPokemonRequest(pokemon, requestId);
  } catch (error) {
    endDialogRequest(requestId);
    renderMessage("Pokemon details could not be loaded.");
  }
}


// Shows loaded data and then adds evolution data.
async function renderLoadedPokemonRequest(pokemon, requestId) {
  showLoadedPokemonDetails(pokemon);
  endDialogRequest(requestId);
  await renderEvolutionSection(pokemon);
}


// Shows loaded Pokemon data based on the screen size.
function showLoadedPokemonDetails(pokemon) {
  pokemonState.activePokemonId = pokemon.id;
  renderLastSelectedPokemon(pokemon);
  renderPokemonDialog(pokemon);
  showPokemonDialog();
}


// Renders the empty start state in the detail panel.
function renderEmptyDetailPanel() {
  getDetailPanel().innerHTML = getEmptyDetailPanelTemplate();
}


// Renders the last selected Pokemon in the detail panel.
function renderLastSelectedPokemon(pokemon) {
  getDetailPanel().innerHTML = getDetailPanelTemplate(pokemon);
  connectDetailNavigationButtons();
}


// Gets the right detail panel from the DOM.
function getDetailPanel() {
  return document.querySelector(".pokemon_detail_panel");
}


// Starts a protected dialog loading request.
function startDialogRequest() {
  pokemonState.isDialogLoading = true;
  pokemonState.dialogRequestId += 1;
  toggleDialogNavigationButtons(true);
  return pokemonState.dialogRequestId;
}


// Ends the current dialog loading request.
function endDialogRequest(requestId) {
  if (!isActiveDialogRequest(requestId)) return;
  pokemonState.isDialogLoading = false;
  toggleDialogNavigationButtons(false);
}


// Checks if the dialog response is still current.
function isActiveDialogRequest(requestId) {
  return pokemonState.dialogRequestId === requestId;
}


// Loads and renders evolution data for the opened Pokemon.
async function renderEvolutionSection(pokemon) {
  try {
    const evolutions = await fetchEvolutionChain(pokemon);
    if (!isActivePokemon(pokemon.id)) return;
    renderLoadedEvolution(evolutions);
  } catch (error) {
    if (isActivePokemon(pokemon.id)) renderEvolutionError();
  }
}


// Renders loaded evolution data in dialog and detail panel.
function renderLoadedEvolution(evolutions) {
  const template = getEvolutionTemplate(evolutions);
  updateEvolutionSection(template);
  updateDetailEvolutionSection(template);
}


// Renders the error state for evolution data.
function renderEvolutionError() {
  const template = getEvolutionErrorTemplate();
  updateEvolutionSection(template);
  updateDetailEvolutionSection(template);
}


// Checks if the loaded Pokemon is still active.
function isActivePokemon(pokemonId) {
  return pokemonState.activePokemonId === pokemonId;
}


// Updates only the evolution area in the dialog.
function updateEvolutionSection(template) {
  const evolutionContent = document.getElementById("dialog_evolution_content");
  if (!evolutionContent) return;
  evolutionContent.innerHTML = template;
}


// Updates only the evolution area in the detail panel.
function updateDetailEvolutionSection(template) {
  const evolutionContent = document.getElementById(
    "detail_panel_evolution_content",
  );
  if (!evolutionContent) return;
  evolutionContent.innerHTML = template;
}


// Renders real Pokemon data into the dialog.
function renderPokemonDialog(pokemon) {
  const dialogContent = document.querySelector(
    "[data-id='overlay-pokemon-name']",
  );
  dialogContent.innerHTML = getPokemonDialogContentTemplate(pokemon);
  connectDialogButtons();
}


// Opens the native Pokemon dialog.
function showPokemonDialog() {
  const pokemonDialog = document.getElementById("pokemon_dialog");
  if (pokemonDialog.open) return;
  lockPageScroll();
  pokemonDialog.showModal();
}


// Connects the dialog buttons with their actions.
function connectDialogButtons() {
  connectDialogCloseButton();
  connectPreviousButton();
  connectNextButton();
  togglePokemonNavigationButtons(false);
}


// Connects the detail panel navigation buttons.
function connectDetailNavigationButtons() {
  const buttons = getDetailNavigationButtons();
  if (!buttons.length) return;
  buttons[0].addEventListener("click", showPreviousPokemon);
  buttons[1].addEventListener("click", showNextPokemon);
  togglePokemonNavigationButtons(false);
}


// Connects the close button with the dialog.
function connectDialogCloseButton() {
  const closeButton = document.querySelector("[data-id='close-dialog-button']");
  closeButton.addEventListener("click", closePokemonDialog);
}


// Connects the Previous button with the previous Pokemon.
function connectPreviousButton() {
  const previousButton = document.querySelector("[data-id='prev-button']");
  previousButton.addEventListener("click", showPreviousPokemon);
}


// Connects the Next button with the next Pokemon.
function connectNextButton() {
  const nextButton = document.querySelector("[data-id='next-button']");
  nextButton.addEventListener("click", showNextPokemon);
}


// Updates dialog navigation for the current state.
function toggleDialogNavigationButtons(isDisabled) {
  togglePokemonNavigationButtons(isDisabled);
}


// Updates all Pokemon navigation buttons for the current state.
function togglePokemonNavigationButtons(isDisabled) {
  const buttons = getDialogNavigationButtons();
  buttons.forEach((button) => {
    button.disabled = isDisabled || !hasDialogNavigation();
  });
}


// Gets all navigation buttons from dialog and detail panel.
function getDialogNavigationButtons() {
  return document.querySelectorAll(
    "[data-id='prev-button'], [data-id='next-button'], .detail_arrow_button",
  );
}


// Gets the navigation buttons from the right detail panel.
function getDetailNavigationButtons() {
  return document.querySelectorAll(".detail_arrow_button");
}


// Checks if more than one visible Pokemon can be navigated.
function hasDialogNavigation() {
  return pokemonState.visiblePokemonIds.length > 1;
}


// Shows the previous Pokemon in the current detail view.
function showPreviousPokemon() {
  if (pokemonState.isDialogLoading) return;
  const previousPokemonId = getPreviousPokemonId();
  openPokemonDetails(previousPokemonId);
}


// Shows the next Pokemon in the current detail view.
function showNextPokemon() {
  if (pokemonState.isDialogLoading) return;
  const nextPokemonId = getNextPokemonId();
  openPokemonDetails(nextPokemonId);
}


// Gets the ID of the previous rendered Pokemon.
function getPreviousPokemonId() {
  const currentIndex = getActivePokemonIndex();
  const lastIndex = pokemonState.visiblePokemonIds.length - 1;
  return (
    pokemonState.visiblePokemonIds[currentIndex - 1] ||
    pokemonState.visiblePokemonIds[lastIndex]
  );
}


// Gets the ID of the next rendered Pokemon.
function getNextPokemonId() {
  const currentIndex = getActivePokemonIndex();
  return (
    pokemonState.visiblePokemonIds[currentIndex + 1] ||
    pokemonState.visiblePokemonIds[0]
  );
}


// Gets the position of the currently opened Pokemon.
function getActivePokemonIndex() {
  return pokemonState.visiblePokemonIds.indexOf(pokemonState.activePokemonId);
}


// Closes the native Pokemon dialog.
function closePokemonDialog() {
  const pokemonDialog = document.getElementById("pokemon_dialog");
  if (!pokemonDialog.open) return;
  pokemonDialog.close();
  unlockPageScroll();
}


// Closes the dialog when the backdrop is clicked.
function handleDialogBackdropClick(event) {
  if (event.target !== event.currentTarget) return;
  closePokemonDialog();
}


// Locks the page at the current scroll position.
function lockPageScroll() {
  pokemonState.scrollPosition = window.scrollY;
  document.body.style.top = `-${pokemonState.scrollPosition}px`;
  document.body.classList.add("dialog_is_open");
}


// Unlocks scrolling and restores the previous position.
function unlockPageScroll() {
  document.body.classList.remove("dialog_is_open");
  document.body.style.top = "";
  window.scrollTo(0, pokemonState.scrollPosition);
}
