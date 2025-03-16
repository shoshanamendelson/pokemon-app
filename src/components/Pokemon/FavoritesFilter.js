import React from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import SearchPokemon from "../SearchPokemon/SearchPokemon";
import {Tooltip} from "antd";
const FavoritesFilter = ({ showFavoritesOnly, toggleFavorites }) => {
    return (
        <div className="favorites-filter">
            <SearchPokemon />
           <Tooltip title={!showFavoritesOnly?'Show only favorites':"Show all Pokémon"}>
               <button
                   onClick={toggleFavorites}
                   style={{
                       backgroundColor: 'lightgray',
                       border: 'none',
                       cursor: 'pointer',
                       padding: '5px',
                       borderRadius: '50%',
                   }}
               >
                   {showFavoritesOnly ?
                       <StarFilled style={{ fontSize: '24px', color: 'gold' }} /> :
                       <StarOutlined style={{ fontSize: '24px' }} />
                   }
               </button>
           </Tooltip>

        </div>
    );
};

export default FavoritesFilter;
