import {makeAutoObservable, observable, action} from 'mobx';
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
    selectedPokemon = null;
    isLoading = true;
    isLoadingDetails = false;
    searchMode = false;
    toastMessage = ''; // Stores the toast message
    toastType = ''; // Stores the type of the toast (e.g. success or error)
    page = 1;

    constructor() {
        makeAutoObservable(this, {
            pokemonList: observable,
            favorites: observable,
            isLoading: observable,
            selectedPokemon: observable,
            fetchPokemon: action,
            fetchFavorites: action,
            addFavorite: action,
            removeFavorite: action,
            fetchPokemonDetails: action,
            setLoading: action,
            setLoadingDetails: action,
            isLoadingDetails: observable,
            searchMode: observable,
            setSearchMode: action,
            toastMessage: observable,
            toastType: observable,
            setToastMessage: action,
            setToastType: action,
            showToast: action,
            page: observable,
        });
    }

    setSearchMode(mode) {
        this.searchMode = mode;
    }

    setLoading(isLoading) {
        this.isLoading = isLoading;
    }

    setLoadingDetails(isLoading) {
        this.isLoadingDetails = isLoading;
    }

    setToastMessage(message) {
        this.toastMessage = message;
    }

    setToastType(type) {
        this.toastType = type;
    }

    // Function to show toast message for a certain time
    showToast(message, type = 'success') {
        this.setToastMessage(message);
        this.setToastType(type);

        setTimeout(() => {
            this.setToastMessage('');
            this.setToastType('');
        }, 3000); // Message disappears after 3 seconds
    }

    // Fetch Pokémon list from the API
    async fetchPokemon(s='') {
        console.log(s)
        this.setLoading(true);
        try {
            const offset = (this.page - 1) * 15; // Calculate offset based on page
            const data = await fetchPokemonFromApi(s, 15, offset);
            const results = Array.isArray(data.results) ? data.results : [data];
            if (this.searchMode) {
                this.pokemonList = results;
            } else {
                this.pokemonList = [...this.pokemonList, ...results]

            }
            this.page++;
        } catch (error) {
            this.showToast(`${error.message}`, "error");
            console.error("No pokemons found", error);
            this.pokemonList = [];
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
            this.showToast(`${pokemon} was added to your favorites!`, "success");

        } catch (error) {
            console.error("Error adding favorite:", error);
            this.showToast(`Failed to add ${pokemon} to favorites. Please try again!`, "error");
        }
    }

    // Remove a Pokémon from the favorites list
    async removeFavorite(pokemonName) {
        try {
            // Send a DELETE request to remove the Pokémon from favorites
            await removeFavoriteFromApi(pokemonName);
            // Refresh the favorites list after removing
            await this.fetchFavorites();
            this.showToast(`${pokemonName} was removed from your favorites!`, "success");

        } catch (error) {
            console.error("Error removing favorite:", error);
            this.showToast(`Failed to remove ${pokemonName} from favorites. Please try again!`, "error");

        }
    }

    // Fetch the details of a selected Pokémon
    async fetchPokemonDetails(pokemonName) {
        this.setLoadingDetails(true); // Set loading to true before fetching details
        try {
            const data = await fetchPokemonDetailsFromApi(pokemonName);
            this.selectedPokemon = data; // Store the selected Pokémon details
            this.showToast(`Successfully fetched details for ${pokemonName}!`, "success");

        } catch (error) {
            this.showToast(`Failed to fetch details for ${pokemonName}. Please try again!`, "error");
            console.error(`Failed to fetch details for ${pokemonName}. Please try again!`, error);
        } finally {
            this.setLoadingDetails(false); // Set loading to false after request is complete
        }
    }
}

const pokemonStore = new PokemonStore();
export default pokemonStore;
