import { makeAutoObservable, observable, action } from 'mobx';
import {
    fetchPokemonFromApi,
    fetchFavoritesFromApi,
    addFavoriteToApi,
    removeFavoriteFromApi,
    fetchPokemonDetailsFromApi
} from '../Services/PokemonService';

class PokemonStore {
    pokemonList = [];
    favorites = [];
    selectedPokemon = null; // Stores the details of the selected Pokémon
    isloading = false;
    isloadingDetails = false;
    searchQuery = '';

    constructor() {
        makeAutoObservable(this, {
            pokemonList: observable,
            favorites: observable,
            isloading: observable,
            selectedPokemon: observable,
            fetchPokemon: action,
            fetchFavorites: action,
            addFavorite: action,
            removeFavorite: action,
            fetchPokemonDetails: action,
            setLoading: action,
            setLoadingDetails: action,
            isloadingDetails: observable,
            searchQuery: observable,
            setSearchQuery: action,
        });
    }
    setSearchQuery(query) {
        this.searchQuery = query;
    }
    setLoading(isLoading) {
        this.isloading = isLoading;
    }

    setLoadingDetails(isLoading) {
        this.isloadingDetails = isLoading;
    }

    // Fetch Pokémon list from the API
    async fetchPokemon() {

        this.setLoading(true);
        try {
            const data = await fetchPokemonFromApi(this.searchQuery);
            console.log(data, 'data');  // It's important to check the data returned from the API

            // If results is an object, turn it into an array
            const results = Array.isArray(data.results) ? data.results : [data];

            const pokemonWithFavorite = results.map(pokemon => ({
                ...pokemon,
                isFavorite: this.favorites.includes(pokemon.name),
            }));

            this.pokemonList = pokemonWithFavorite;
        } catch (error) {
            console.error("Error fetching Pokémon:", error);
        } finally {
            this.setLoading(false);
        }
    }



    // Fetch the list of favorites from the backend
    async fetchFavorites() {
        try {
            const data = await fetchFavoritesFromApi();
            this.favorites = data;
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    }

    // Add a Pokémon to the favorites list
    async addFavorite(pokemon) {
        try {
            await addFavoriteToApi(pokemon);
            this.fetchFavorites(); // Refresh the favorites list after adding
        } catch (error) {
            console.error("Error adding favorite:", error);
        }
    }

    // Remove a Pokémon from the favorites list
    async removeFavorite(pokemonName) {
        try {
            // Send a DELETE request to remove the Pokémon from favorites
            await removeFavoriteFromApi(pokemonName);

            // Refresh the favorites list after removing
            this.fetchFavorites();
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    }

    // Fetch the details of a selected Pokémon
    async fetchPokemonDetails(pokemonName) {
        this.setLoadingDetails(true); // Set loading to true before fetching details
        try {
            const data = await fetchPokemonDetailsFromApi(pokemonName);
            this.selectedPokemon = data; // Store the selected Pokémon details
        } catch (error) {
            console.error("Error fetching Pokémon details:", error);
        } finally {
            this.setLoadingDetails(false); // Set loading to false after request is complete
        }
    }
}

const pokemonStore = new PokemonStore();
export default pokemonStore;
