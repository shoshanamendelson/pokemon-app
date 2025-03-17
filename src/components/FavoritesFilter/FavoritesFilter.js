import React from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import SearchPokemon from "../SearchPokemon/SearchPokemon";
import { Tooltip } from "antd";
import "./FavoritesFilter.css";

/**
 * FavoritesFilter Component
 *
 * This component provides a filtering option for displaying only favorite Pokémon.
 * It includes:
 * - A search input (SearchPokemon component) for finding specific Pokémon.
 * - A toggle button that allows users to switch between showing all Pokémon or only their favorites.
 * - An icon-based button (StarOutlined or StarFilled) to visually represent the filter state.
 * - A tooltip that provides additional information about the current filter state.
 *
 * Props:
 * @param {boolean} showFavoritesOnly - Determines if only favorite Pokémon should be displayed.
 * @param {function} toggleFavorites - Function to toggle between showing all Pokémon and favorites only.
 */
const FavoritesFilter = ({ showFavoritesOnly, toggleFavorites }) => {
    return (
        <div className="favorites-filter">
            <SearchPokemon />
            <Tooltip title={!showFavoritesOnly ? 'Show only favorites' : "Show all Pokémon"}>
                <button className="favorites-button" onClick={toggleFavorites}>
                    {showFavoritesOnly ?
                        <StarFilled className="favorites-icon filled" /> :
                        <StarOutlined className="favorites-icon" />
                    }
                </button>
            </Tooltip>
        </div>
    );
};

export default FavoritesFilter;
