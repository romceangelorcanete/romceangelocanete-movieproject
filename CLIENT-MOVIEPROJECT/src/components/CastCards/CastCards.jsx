import React from 'react';
import './CastCards.css';

function CastCards({ cast }) {
    const castImage = cast?.profile_path
        ? `https://image.tmdb.org/t/p/original/${cast.profile_path}`
        : cast?.url
        ? cast.url
        : require('../../components/CastCards/NO CAST.jpg'); // Fallback image if none is provided

    return (
        <div className="card-cast-data">
            <img 
                src={castImage} 
                alt={cast.name || 'No Image Available'} 
                className="cast-image-card" 
            />
            <span className="cast-name-card">{cast.name || 'Unknown Name'}</span>
            <hr className="spacing-cast-card" />
            <span className="cast-characterName-card">
                {cast.characterName || 'Unknown Character'}
            </span>
        </div>
    );
}

export default CastCards;
