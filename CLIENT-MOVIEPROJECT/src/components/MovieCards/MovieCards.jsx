import React from 'react';
import './MovieCards.css';

function MovieCards({ movie, onClick }) {
  console.log(movie); // Debugging line
  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'Unknown Year';

  return (
    <div className="card-movie" onClick={onClick}>
      <img src={movie.posterPath} alt="movie poster" />
      <div className="movie-details">
        <div className="movie-info">
          <span className="movie-rating">⭐ {movie.voteAverage}</span>
          <span className="movie-year">{year}</span>
        </div>
        <span className="movie-title">{movie.title}</span>
      </div>
    </div>
  );
}

export default MovieCards;
