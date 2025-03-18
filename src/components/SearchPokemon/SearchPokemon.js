import React from 'react';
import { observer } from 'mobx-react';
import pokemonStore from '../../stores/PokemonStore';
import './SearchPokemon.css';

/**
 * SearchPokemon Component
 *
 * This component provides a search functionality for Pokémon.
 * It allows users to enter a Pokémon name and fetch relevant details.
 *
 * Features:
 * - Uses local state to track the search input.
 * - Updates `pokemonStore` to enable or disable search mode.
 * - Calls the `fetchPokemon` function with the search query.
 * - Displays a toast message for user feedback.
 */
const SearchPokemon = observer(() => {

    const [search, setSearch] = React.useState('');
    const handleSearch = (e) => {
        pokemonStore.searchData = [];
        const query = e.target.value;
        setSearch(query);
        if (query === "") {
            pokemonStore.setSearchMode(false);
        }
    };

    return (
        <div className="search-container">
            <div className="search-input-container">
                <input
                    id="search"
                    type="text"
                    placeholder="Enter the full Pokémon name..."
                    value={search}
                    onChange={(e) => handleSearch(e)}
                    className="search-input"
                    onKeyDown={(e) => e.key === "Enter" && pokemonStore.fetchPokemon(search)}
                />
                <button onClick={() => pokemonStore.fetchPokemon(search)} className="search-button">
                    Search
                </button>
            </div>

            {pokemonStore.toastMessage && (
                <div className={`toast ${pokemonStore.toastType}`}>
                    {pokemonStore.toastMessage}
                </div>
            )}
        </div>
    );
});

export default SearchPokemon;
