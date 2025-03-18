import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import pokemonStore from "../../stores/PokemonStore";
import './Pokemon.css';
import { Spin, Tooltip } from 'antd';
import PokemonDetails from "../PokemonDetails/PokemonDetails";
import '../CustomToast/CustomToast.css'
import { ReactComponent as WavesSvg } from "../../logo.svg";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { StarOutlined } from '@ant-design/icons';
import FavoritesFilter from "../FavoritesFilter/FavoritesFilter";

const PokemonList = observer(() => {
    const [showDetails, setShowDetails] = useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // State for toggling favorites filter

    /**
     * Implements infinite scrolling.
     * Loads more Pokémon when the user scrolls down, unless all 150 Pokémon are loaded.
     */
    const [sentryRef, { rootRef }] = useInfiniteScroll({
        loading: pokemonStore.isLoading,
        hasNextPage: pokemonStore.pokemonList.length < 150 && !pokemonStore.searchMode,
        onLoadMore: () => pokemonStore.fetchPokemon(),
        rootMargin: '0px 0px 50px 0px',
    });

    /**
     * Fetches the initial list of Pokémon and favorite Pokémon when the component mounts.
     */
    useEffect(() => {
        const fetchData = async () => {
            await pokemonStore.fetchFavorites();
            await pokemonStore.fetchPokemon();
        };
        fetchData();
    }, []);

    /**
     * Handles the click event when a Pokémon is selected.
     * Fetches details of the selected Pokémon and displays the details modal.
     */
    const handlePokemonClick = (pokemonName) => {
        pokemonStore.fetchPokemonDetails(pokemonName);
        setShowDetails(true);
    };

    /**
     * Renders a loading spinner, either in the center or for infinite scrolling.
     */
    const renderLoading = (fromScroll) => (
        <div className={fromScroll ? 'spinner-scroll' : "spinner-container"}>
            <Spin size="large" tip="Loading Pokémon..." className="red-spinner" />
        </div>
    );

    /**
     * Toggles the favorites filter.
     * When active, only favorite Pokémon are displayed.
     */
    const toggleFavorites = () => {
        setShowFavoritesOnly(!showFavoritesOnly);
    };

    /**
     * Returns a filtered list containing only favorite Pokémon.
     */
    const getFilteredPokemonList = (data) => {
        return data?.filter((pokemon) =>
            pokemonStore.favorites.includes(pokemon.name)
        );
    };

    /**
     * Renders the list of Pokémon.
     * Supports infinite scrolling and filtering favorites.
     */
    const renderPokemonList = () => {
        // const pokemonList = pokemonStore.searchMode
        //     ? pokemonStore.searchData
        //     : showFavoritesOnly
        //         ? getFilteredPokemonList()
        //         : pokemonStore.pokemonList;
        const data = pokemonStore.searchMode ? pokemonStore.searchData : pokemonStore.pokemonList;
        const pokemonList = showFavoritesOnly ? getFilteredPokemonList(data) : data;
        const hasMore =
            pokemonStore.pokemonList.length < 120 &&
            !pokemonStore.searchMode &&
            !pokemonStore.isLoading &&
            !showFavoritesOnly;

        const isEmptyList = pokemonList?.length === 0 && !pokemonStore.isLoading
        const isLoadingInitial = pokemonStore.isLoading && pokemonStore.pokemonList?.length === 0||pokemonStore.loadingSearch;

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
                                className={pokemonStore.favorites.includes(pokemon.name) ? 'gold-button' : ''}
                            >
                                {pokemonStore.favorites.includes(pokemon.name) ? '⭐' : <StarOutlined />}
                            </button>
                        </li>
                    ))}
                </ul>
                {pokemonStore.isLoading && renderLoading(true)}
                {hasMore && <div ref={sentryRef} style={{ height: '50px' }} />}
            </div>
        );
    };

    /**
     * Adds or removes a Pokémon from the favorites list.
     * If the Pokémon is already a favorite, it is removed.
     * Otherwise, it is added to the favorites.
     */
    const toggleFavorite = (pokemon) => {
        if (pokemonStore.favorites.includes(pokemon?.name)) {
            pokemonStore.removeFavorite(pokemon?.name);
        } else {
            pokemonStore.addFavorite(pokemon?.name);
        }
    };

    /**
     * Renders the Pokémon details component if a Pokémon is selected.
     */
    const renderPokemonDetails = () => (
        showDetails && pokemonStore.selectedPokemon && (
            <PokemonDetails setShowDetails={setShowDetails} />
        )
    );

    /**
     * Renders the title of the Pokémon list with a wave icon.
     */
    const title = () => (
        <div>
            <h1 className="title">
                Pokemon List
                <WavesSvg className="wave-icon" width="50px" height="50px" />
            </h1>
        </div>
    );

    /**
     * Renders the entire component, including the title, filter, Pokémon list, and details.
     */
    return (
        <div>
            {title()}
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
