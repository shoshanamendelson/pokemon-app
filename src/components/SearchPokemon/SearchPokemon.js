import React from 'react';
import { observer } from 'mobx-react';
import pokemonStore from '../../stores/PokemonStore';
import './SearchPokemon.css';

const SearchPokemon = observer(() => {
    const [search, setSearch] = React.useState('');
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearch(query);
        pokemonStore.setSearchMode(query !== '');
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
