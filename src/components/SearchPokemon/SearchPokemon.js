import React, { useCallback } from "react";
import { observer } from "mobx-react";
import pokemonStore from "../PokemonStore";
import "./SearchPokemon.css";

const SearchPokemon = observer(() => {
    // Memoized function to handle search
    const handleSearch = useCallback(() => {
            pokemonStore.fetchPokemon(pokemonStore.searchQuery);
    }, []);

    // Handle input change with useCallback
    const handleInputChange = useCallback((e) => {
        pokemonStore.setSearchQuery(e.target.value);
    }, []);

    // Trigger search when pressing Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="search-container">
            <div className="search-input-container">
                <input
                    id="search"
                    type="text"
                    placeholder="Enter the full Pokémon name..."
                    value={pokemonStore.searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>
        </div>
    );
});

export default SearchPokemon;
