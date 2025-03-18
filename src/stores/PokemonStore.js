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
    selectedPokemon = null;
    isLoading = true;
    isLoadingDetails = false;
    searchMode = false;
    toastMessage = ''; // Stores the toast message
    toastType = ''; // Stores the type of the toast (e.g. success or error)
    page = 1;
    searchData = [];
    loadingSearch = false;

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
            searchData:observable,
            loadingSearch:observable,
            setLoadingSearch:action,
        });
    }

    /**
     * Sets the search mode.
     * If enabled, only searched Pokémon will be displayed.
     * @param {boolean} mode - The search mode state.
     */
    setSearchMode(mode) {
        this.searchMode = mode;
    }
    setLoadingSearch(mode) {
        this.loadingSearch = mode;
    }

    /**
     * Sets the loading state for fetching Pokémon.
     * @param {boolean} isLoading - Whether the Pokémon list is loading.
     */
    setLoading(isLoading) {
        this.isLoading = isLoading;
    }

    /**
     * Sets the loading state for fetching Pokémon details.
     * @param {boolean} isLoading - Whether the details are loading.
     */
    setLoadingDetails(isLoading) {
        this.isLoadingDetails = isLoading;
    }

    /**
     * Sets the toast message.
     * @param {string} message - The message to be displayed.
     */
    setToastMessage(message) {
        this.toastMessage = message;
    }

    /**
     * Sets the toast type (e.g., success or error).
     * @param {string} type - The type of the toast message.
     */
    setToastType(type) {
        this.toastType = type;
    }

    /**
     * Displays a toast message for a short duration.
     * @param {string} message - The message to display.
     * @param {string} [type='success'] - The type of the toast (default: success).
     */
    showToast(message, type = 'success') {
        this.setToastMessage(message);
        this.setToastType(type);

        setTimeout(() => {
            this.setToastMessage('');
            this.setToastType('');
        }, 3000); // Message disappears after 3 seconds
    }

    /**
     * Fetches the list of Pokémon from the API.
     * If a search query is provided, fetches the corresponding Pokémon.
     * Otherwise, fetches a paginated list.
     * @param {string} [search=''] - The Pokémon name to search for (optional).
     */
    async fetchPokemon(search = '') {
        pokemonStore.setSearchMode(search !== '');
        this.setLoading(true);
        try {
            const offset = (this.page - 1) * 15; // Calculate offset based on page
            const data = await fetchPokemonFromApi(search, 15, offset);
            const results = Array.isArray(data.results) ? data.results : [data];
            if (this.searchMode) {
                this.setLoadingSearch(true);
                this.searchData = results;
            } else {
                this.pokemonList = [...this.pokemonList, ...results];
                this.page++;
                this.searchData = [];
            }
        } catch (error) {
            this.searchMode ? this.showToast(`No Pokémon found with the name ${search}`, "error"):
            this.showToast(`${error.message}`, "error");
            console.error("No Pokémon found", error);
            this.pokemonList = [];
        } finally {
            this.setLoading(false);
            this.setLoadingSearch(false);
        }
    }

    /**
     * Fetches the list of favorite Pokémon from the backend.
     */
    async fetchFavorites() {
        try {
            const data = await fetchFavoritesFromApi();
            this.favorites = data;
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    }

    /**
     * Adds a Pokémon to the favorites list.
     * Updates the favorites list after the addition.
     * @param {string} pokemon - The name of the Pokémon to add to favorites.
     */
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

    /**
     * Removes a Pokémon from the favorites list.
     * Updates the favorites list after the removal.
     * @param {string} pokemonName - The name of the Pokémon to remove from favorites.
     */
    async removeFavorite(pokemonName) {
        try {
            await removeFavoriteFromApi(pokemonName); // Send a DELETE request
            await this.fetchFavorites(); // Refresh the favorites list
            this.showToast(`${pokemonName} was removed from your favorites!`, "success");
        } catch (error) {
            console.error("Error removing favorite:", error);
            this.showToast(`Failed to remove ${pokemonName} from favorites. Please try again!`, "error");
        }
    }

    /**
     * Fetches details of a specific Pokémon.
     * Updates the selected Pokémon state.
     * @param {string} pokemonName - The name of the Pokémon to fetch details for.
     */
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
