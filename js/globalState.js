// Speichert zentrale App-Werte, geladene Pokemon und den Ladezustand.
const pokemonState = {
  baseUrl: "https://pokeapi.co/api/v2",
  initialAmount: 20,
  loadAmount: 20,
  nextPokemonId: 1,
  maxPokemonId: 1025,
  isLoading: false,
  isSearchActive: false,
  activePokemonId: null,
  scrollPosition: 0,
  pokemonCache: {},
  speciesCache: {},
  evolutionCache: {},
  renderedPokemonIds: [],
};
