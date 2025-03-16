import React from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import SearchPokemon from "../SearchPokemon/SearchPokemon";
import { Tooltip } from "antd";
import "./FavoritesFilter.css";

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
