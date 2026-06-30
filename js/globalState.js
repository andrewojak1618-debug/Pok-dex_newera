/**
 * Stores central app values, loaded Pokemon, and loading state.
 */
const pokemonState = {
  baseUrl: "https://pokeapi.co/api/v2",
  initialAmount: 20,
  loadAmount: 20,
  nextPokemonId: 1,
  maxPokemonId: 151,
  isLoading: false,
  isDialogLoading: false,
  isSearchActive: false,
  activePokemonId: null,
  dialogRequestId: 0,
  scrollPosition: 0,
  pokemonCache: {},
  pokemonListCache: null,
  searchResultCache: {},
  speciesCache: {},
  evolutionCache: {},
  renderedPokemonIds: [],
  visiblePokemonIds: [],
};
