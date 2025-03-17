/**
 * Fetches a list of Pokémon from the backend.
 *
 * @param {string} searchQuery - The name of the Pokémon to search for (optional).
 * @param {number} limit - The number of Pokémon to fetch (default is 10).
 * @param {number} offset - The number of Pokémon to skip before starting to fetch.
 * @returns {Promise<Object>} - The JSON response containing the Pokémon data.
 *
 * If a search query is provided, it fetches a specific Pokémon.
 * Otherwise, it fetches a paginated list of Pokémon.
 */
export const fetchPokemonFromApi = async (searchQuery = "", limit = 10, offset = 0) => {
    // If there's a search query, include it in the URL
    const url = searchQuery
        ? `http://localhost:5000/api/pokemon/${searchQuery}?limit=${limit}&offset=${offset}`
        : `http://localhost:5000/api/pokemon?limit=${limit}&offset=${offset}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch Pokémon");
    }
    return await res.json();
};

/**
 * Fetches the list of favorite Pokémon from the backend.
 *
 * @returns {Promise<Object>} - The JSON response containing the favorite Pokémon.
 */
export const fetchFavoritesFromApi = async () => {
    const res = await fetch("http://localhost:5000/api/favorites");
    return await res.json();
};

/**
 * Adds a Pokémon to the favorites list via the backend.
 *
 * @param {string} pokemon - The name of the Pokémon to add to favorites.
 * @returns {Promise<void>}
 */
export const addFavoriteToApi = async (pokemon) => {
    await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pokemon })
    });
};

/**
 * Removes a Pokémon from the favorites list via the backend.
 *
 * @param {string} pokemonName - The name of the Pokémon to remove from favorites.
 * @returns {Promise<void>}
 */
export const removeFavoriteFromApi = async (pokemonName) => {
    await fetch(`http://localhost:5000/api/favorites/${pokemonName}`, {
        method: "DELETE"
    });
};

/**
 * Fetches detailed information about a specific Pokémon.
 *
 * @param {string} pokemonName - The name of the Pokémon to fetch details for.
 * @returns {Promise<Object>} - The JSON response containing the Pokémon details.
 */
export const fetchPokemonDetailsFromApi = async (pokemonName) => {
    const res = await fetch(`http://localhost:5000/api/pokemon/${pokemonName}`);
    return await res.json();
};
