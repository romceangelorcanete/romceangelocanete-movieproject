import React from 'react';
import './PhotoCards.css';

function PhotoCards({ photos, onClick }) {
    return (
        <div className='card-photo-data'>
            <img src={photos.url} alt='photo-movie' />
            <span className='photo-descript-card'>{photos.description}</span>
        </div>
    );
}

export default PhotoCards;