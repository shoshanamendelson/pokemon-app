import React from 'react';
import {observer} from 'mobx-react';
import pokemonStore from "../../stores/PokemonStore";
import '../Pokemon/Pokemon.css';

const PokemonDetails = observer(({setShowDetails}) => {

    return (
        <div className="pokemon-details">
            <div className="pokemon-card">
                {
                    pokemonStore.isloadingDetails ? (
                            <div className='loading'>Loading..</div>
                        ) :
                        <>
                            <h2>{pokemonStore.selectedPokemon.name}</h2>
                            <p>
                                <strong>Abilities:</strong> {pokemonStore.selectedPokemon.abilities.map((ability) => ability.ability.name).join(", ")}
                            </p>
                            <p>
                                <strong>Types:</strong> {pokemonStore.selectedPokemon.types.map((type) => type.type.name).join(", ")}
                            </p>
                            {pokemonStore.selectedPokemon.evolution && <h3>Evolution Chain:</h3>}
                            <ul>
                                {pokemonStore.selectedPokemon.evolution && (
                                    <li>{pokemonStore.selectedPokemon.evolution.chain.species.name}</li>
                                )}
                            </ul>
                            <button onClick={() => setShowDetails(false)}>Close</button>
                        </>
                }
            </div>
        </div>
    );
});

export default PokemonDetails;
