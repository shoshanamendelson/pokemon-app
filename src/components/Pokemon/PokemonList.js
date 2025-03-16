import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import pokemonStore from "../../stores/PokemonStore";
import './Pokemon.css';
import {Spin} from 'antd';
import PokemonDetails from "../PokemonDetails/PokemonDetails";
import ToastDemo from "../CustomToast/CustomToast";

const PokemonList = observer(() => {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        pokemonStore.fetchPokemon();
    }, [pokemonStore.favorites]);

    const handlePokemonClick = (pokemonName) => {
        pokemonStore.fetchPokemonDetails(pokemonName);
        setShowDetails(true);
    };

    if (pokemonStore.isloading) {
        return (
            <div className="spinner-container">
                <Spin size="large" tip="Loading Pokémon..."/>
            </div>
        );
    }

    return (
        <div>
            <h1 className='title'>Pokemon List</h1>
            <ul>
                {pokemonStore.pokemonList.map((pokemon, index) => (
                    <li key={index}>
                        <button onClick={() => handlePokemonClick(pokemon.name)}>
                            {pokemon.name}
                        </button>
                        <button
                            onClick={() => pokemonStore.addFavorite(pokemon.name)}
                            style={{ backgroundColor: pokemon.isFavorite ? 'gold' : 'lightgray' }}
                        >
                            {pokemon?.isFavorite ? '★ Favorited' : 'Add to Favorites'}
                        </button>


                        {pokemon?.isFavorite &&<button
                            onClick={() => pokemonStore.removeFavorite(pokemon.name)}
                            style={{ backgroundColor: 'red' }}
                        >
                            Remove from Favorites
                        </button>}
                    </li>
                ))}

            </ul>
            {                <ToastDemo/>
            }
            {showDetails && pokemonStore.selectedPokemon && (
                <PokemonDetails setShowDetails={setShowDetails} />
            )}
        </div>
    );
});

export default PokemonList;
