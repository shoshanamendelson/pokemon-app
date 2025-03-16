import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import pokemonStore from "../PokemonStore";
import '../Pokemon/Pokemon.css';
import { Spin } from 'antd';

const PokemonDetails = observer(({ setShowDetails }) => {
    const { isloadingDetails, selectedPokemon } = pokemonStore;

    const formatList = (items, key) => {
        return items.map((item) => item[key].name).join(", ");
    };

    const PokemonInfoList = ({ title, items, keyName }) => {
        const formattedText = useMemo(() => formatList(items, keyName), [items, keyName]);
        return <p><strong>{title}:</strong> {formattedText}</p>;
    };


    const PokemonEvolution = ({ evolution }) => {
        if (!evolution) return null;
        return (
            <>
                <h3>Evolution Chain:</h3>
                <ul>
                    <li>{evolution?.chain?.species?.name}</li>
                </ul>
            </>
        );
    };

    return (
        <div className="pokemon-details">
            <div className="pokemon-card">
                {isloadingDetails ? (
                    <div className="loading-container">
                        <Spin size="large" tip="Loading Pokémon details..." />
                    </div>
                ) : (
                    <>
                        <h2>{selectedPokemon?.name}</h2>
                        <PokemonInfoList title="Abilities" items={selectedPokemon.abilities} keyName="ability" />
                        <PokemonInfoList title="Types" items={selectedPokemon.types} keyName="type" />
                        <PokemonEvolution evolution={selectedPokemon?.evolution} />
                        <button onClick={() => setShowDetails(false)}>Close</button>
                    </>
                )}
            </div>
        </div>
    );
});

export default PokemonDetails;
