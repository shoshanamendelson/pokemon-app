import { makeAutoObservable, observable, action } from 'mobx';
import {
    fetchPokemonFromApi,
    fetchFavoritesFromApi,
    addFavoriteToApi,
    removeFavoriteFromApi,
    fetchPokemonDetailsFromApi
} from '../Services/PokemonService';
import CustomToast from "../components/CustomToast/CustomToast";

class PokemonStore {
    pokemonList = [];
    favorites = [];
    selectedPokemon = null; // Stores the details of the selected Pokémon
    isloading = false;
    isloadingDetails = false;

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
            isloadingDetails: observable
        });
    }

    setLoading(isLoading) {
        this.isloading = isLoading;
    }

    setLoadingDetails(isLoading) {
        this.isloadingDetails = isLoading;
    }

    // Fetch Pokémon list from the API
    async fetchPokemon() {
        this.setLoading(true); // Set loading to true before making the request
        try {
            // If pokemonList is empty, fetch both Pokémon and favorites
            if (this.pokemonList.length === 0) {
                this.fetchFavorites();
                const data = await fetchPokemonFromApi();
                // Add 'isFavorite' flag for each Pokémon
                const pokemonWithFavorite = data.results.map(pokemon => {
                    const isFavorite = this.favorites.includes(pokemon.name);
                    return { ...pokemon, isFavorite };
                });

                this.pokemonList = pokemonWithFavorite; // Update the Pokémon list with the 'isFavorite' status
            } else {
                // If Pokémon list already exists, just update the 'isFavorite' status
                this.pokemonList = this.pokemonList.map(pokemon => {
                    const isFavorite = this.favorites.includes(pokemon.name);
                    return { ...pokemon, isFavorite };
                });
            }

        } catch (error) {
            console.error("Error fetching Pokémon:", error);
        } finally {
            this.setLoading(false); // Set loading to false after request is complete
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
