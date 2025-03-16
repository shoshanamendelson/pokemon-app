import React, {useEffect, useState, useMemo} from 'react';
import {observer} from 'mobx-react';
import pokemonStore from "../PokemonStore";
import './Pokemon.css';
import {Spin, Tooltip} from 'antd';
import PokemonDetails from "../PokemonDetails/PokemonDetails";
import '../CustomToast/CustomToast.css'
import {ReactComponent as WavesSvg} from "../../logo.svg";

import {
    StarOutlined,
} from '@ant-design/icons';
import FavoritesFilter from "../FavoritesFilter/FavoritesFilter";

const PokemonList = observer(() => {
    const [showDetails, setShowDetails] = useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // State for toggling favorites filter

    useEffect(() => {
        pokemonStore.fetchPokemon();
    }, [pokemonStore.favorites]);

    useEffect(() => {
        pokemonStore.fetchFavorites();
    }, []);

    const handlePokemonClick = (pokemonName) => {
        pokemonStore.fetchPokemonDetails(pokemonName);
        setShowDetails(true); // Show Pokémon details after selecting a Pokémon
    };

    const filteredPokemonList = useMemo(() => {
        return showFavoritesOnly
            ? pokemonStore?.pokemonList?.filter(pokemon => pokemon.isFavorite)
            : pokemonStore?.pokemonList;
    }, [showFavoritesOnly, pokemonStore?.pokemonList]);


    const renderLoading = () => (
        <div className="spinner-container">
            <Spin size="large" tip="Loading Pokémon..." className="red-spinner" />
        </div>
    );

    const toggleFavorites = () => {
        setShowFavoritesOnly(!showFavoritesOnly);
    };

    const renderPokemonList = () => (
        filteredPokemonList.length === 0 ? (
            <div className="no-data">No Pokémon found! 😢</div>
        ) : (
            <ul>
                {filteredPokemonList.map((pokemon) => (
                    <li key={pokemon.url}>
                        <Tooltip title="Click here to get all details">
                            <div className="poc-name" onClick={() => handlePokemonClick(pokemon.name)}>
                                {pokemon.name}
                            </div>
                        </Tooltip>

                        <button
                            onClick={() => toggleFavorite(pokemon)}
                            style={{ backgroundColor: pokemon.isFavorite ? 'gold' : 'lightgray' }}
                        >
                            {pokemon.isFavorite ? '⭐' : <StarOutlined />}
                        </button>
                    </li>
                ))}
            </ul>
        )
    );


    const toggleFavorite = (pokemon) => {
        if (pokemon?.isFavorite) {
            pokemonStore.removeFavorite(pokemon?.name);
        } else {
            pokemonStore.addFavorite(pokemon?.name);
        }
    };

    const renderPokemonDetails = () => (
        showDetails && pokemonStore.selectedPokemon && (
            <PokemonDetails setShowDetails={setShowDetails}/>
        )
    );
    return (
        <div>
            <h1 className='title'>Pokemon List {<WavesSvg width="50px%" height="50px"/>} </h1>
            <FavoritesFilter
                showFavoritesOnly={showFavoritesOnly}
                toggleFavorites={toggleFavorites}
            />
            {pokemonStore.isLoading?renderLoading():renderPokemonList()}
            {renderPokemonDetails()}
        </div>
    );
});

export default PokemonList;
