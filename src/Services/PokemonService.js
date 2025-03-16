
export const fetchPokemonFromApi = async () => {
    const res = await fetch("http://localhost:5000/api/pokemon");
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
