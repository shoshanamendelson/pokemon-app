import React from 'react';
import { observer } from 'mobx-react';
import pokemonStore from '../../stores/PokemonStore';
import './SearchPokemon.css';

const SearchPokemon = observer(() => {
    return (
        <div className="search-container">
            <div className="search-input-container">
                <input
                    id="search"
                    type="text"
                    placeholder="Enter the full Pokémon name..."
                    value={pokemonStore.searchQuery}
                    onChange={(e) => pokemonStore.setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button onClick={() => pokemonStore.fetchPokemon()} className="search-button">
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
