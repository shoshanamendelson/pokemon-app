
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



export const fetchFavoritesFromApi = async () => {
    const res = await fetch("http://localhost:5000/api/favorites");
    return await res.json();
};

export const addFavoriteToApi = async (pokemon) => {
    await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pokemon })
    });
};

export const removeFavoriteFromApi = async (pokemonName) => {
    await fetch(`http://localhost:5000/api/favorites/${pokemonName}`, {
        method: "DELETE"
    });
};

export const fetchPokemonDetailsFromApi = async (pokemonName) => {
    const res = await fetch(`http://localhost:5000/api/pokemon/${pokemonName}`);
    return await res.json();
};
