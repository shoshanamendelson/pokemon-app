import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import pokemonStore from "../../stores/PokemonStore";
import './Pokemon.css';
import {Spin, Tooltip} from 'antd';
import PokemonDetails from "../PokemonDetails/PokemonDetails";
import '../CustomToast/CustomToast.css'
import {ReactComponent as WavesSvg} from "../../logo.svg";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import {
    StarOutlined,
} from '@ant-design/icons';
import FavoritesFilter from "../FavoritesFilter/FavoritesFilter";

const PokemonList = observer(() => {
    const [showDetails, setShowDetails] = useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // State for toggling favorites filter
    const [sentryRef, { rootRef }] = useInfiniteScroll({
        loading: pokemonStore.isLoading,
        hasNextPage:  pokemonStore.pokemonList.length<150&&!pokemonStore.searchMode,
        onLoadMore: ()=>pokemonStore.fetchPokemon(),
        rootMargin: '0px 0px 50px 0px',
    })
    useEffect(() => {
        pokemonStore.fetchPokemon();
        pokemonStore.fetchFavorites();
    }, []);


    const handlePokemonClick = (pokemonName) => {
        pokemonStore.fetchPokemonDetails(pokemonName);
        setShowDetails(true); // Show Pokémon details after selecting a Pokémon
    };

    const renderLoading = () => (
        <div className="spinner-container">
            <Spin size="large" tip="Loading Pokémon..." className="red-spinner" />
        </div>
    );

    const toggleFavorites = () => {
        setShowFavoritesOnly(!showFavoritesOnly);
    };

    const getFilteredPokemonList = () => {
            return pokemonStore?.pokemonList?.filter((pokemon) =>
                pokemonStore.favorites.includes(pokemon.name)
            );
    };



    const renderPokemonList = () => {
        const pokemonList = showFavoritesOnly ? getFilteredPokemonList() : pokemonStore.pokemonList;
        const hasMore =
            pokemonStore.pokemonList.length < 120 &&
            !pokemonStore.searchMode &&
            !pokemonStore.isLoading &&
            !showFavoritesOnly;

        const isEmptyList = pokemonList?.length === 0 && !pokemonStore.isLoading;
        const isLoadingInitial = pokemonStore.isLoading && pokemonStore.pokemonList?.length === 0;

        if (isEmptyList) {
            return <div className="no-data">No Pokémon found! 😢</div>;
        }

        if (isLoadingInitial) {
            return renderLoading();
        }

        return (
            <div className='list-container' ref={rootRef}>
                <ul>
                    {pokemonList?.map((pokemon) => (
                        <li key={pokemon.url}>
                            <Tooltip title="Click here to get all details">
                                <div className="poc-name" onClick={() => handlePokemonClick(pokemon.name)}>
                                    {pokemon.name}
                                </div>
                            </Tooltip>

                            <button
                                onClick={() => toggleFavorite(pokemon)}
                                style={{ backgroundColor: pokemonStore.favorites.includes(pokemon.name) ? 'gold' : 'lightgray' }}
                            >
                                {pokemonStore.favorites.includes(pokemon.name) ? '⭐' : <StarOutlined />}
                            </button>
                        </li>
                    ))}
                </ul>
                {hasMore && <div ref={sentryRef} style={{ height: '10px' }} />}
            </div>
        );
    };


    const toggleFavorite = (pokemon) => {
        if (pokemonStore.favorites.includes(pokemon?.name)) {
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
            {renderPokemonList()}
            {renderPokemonDetails()}
        </div>
    );
});

export default PokemonList;
