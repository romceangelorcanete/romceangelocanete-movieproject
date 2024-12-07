import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../../../context/context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Modal from 'react-modal'; // Import react-modal
import MovieCards from '../../../components/MovieCards/MovieCards';

function Home() {
  const { auth, lists, setLists, setMovie } = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trailers, setTrailers] = useState({});
  const [currentTrailer, setCurrentTrailer] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  Modal.setAppElement('#root');

  const getMovies = useCallback(() => {
    let isMounted = true;

    axios({
      method: 'get',
      url: '/movies',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {
        if (!isMounted) return;
        const movies = response.data;
        const featured = movies.filter(
          (movie) => movie.isFeatured === true || movie.isFeatured === 'true'
        );
        setFeaturedMovies(featured.slice(0, 3));
        setLists(movies);
      })
      .catch((error) => console.error('Error fetching movies:', error));

    return () => {
      isMounted = false;
    };
  }, [auth.accessToken, setLists]);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  useEffect(() => {
    featuredMovies.forEach((movie) => {
      if (movie.tmdbId) {
        fetchTrailer(movie.tmdbId);
      }
    });
  }, [featuredMovies]);

  const getPopularityColor = (popularity) => {
    if (popularity > 80) return 'red';
    if (popularity > 50) return 'yellow';
    return 'green';
  };

  const fetchTrailer = (tmdbId) => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${tmdbId}/videos`, {
        params: {
          api_key: 'ff706f2d40004e50c8f8e0d881cc3330', // Your API Key
        },
      })
      .then((response) => {
        const trailer = response.data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
          const embedUrl = `https://www.youtube.com/embed/${trailer.key}`;
          setTrailers((prevState) => ({
            ...prevState,
            [tmdbId]: embedUrl, // Save embed URL
          }));
        }
      })
      .catch((error) => console.error('Error fetching trailer:', error));
  };

  const openModal = (trailerUrl) => {
    setCurrentTrailer(trailerUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentTrailer('');
    setIsModalOpen(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <div className='main-container'>
      <div className='featured-slider'>
        {featuredMovies.length > 0 ? (
          <Slider {...settings}>
            {featuredMovies.map((movie) => {
              const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'Unknown Year';
              const popularityColor = getPopularityColor(movie.popularity);

              return (
                <div
                  key={movie.id}
                  className='slider-item'
                  onClick={() => setMovie(movie)}
                >
                  <div
                    className='featured-backdrop'
                    style={{
                      backgroundImage: `url(${movie.backdropPath !== 'https://image.tmdb.org/t/p/original/undefined'
                        ? movie.backdropPath
                        : movie.posterPath})`,
                    }}
                  >
                    <div className='Movies-Title-Description'>
                      <h1 className='title-movies-h1'>{movie.title}</h1>
                      <div className='title-movie-year'>
                        <span>{year}</span>
                      </div>
                      <p className='overview-movies-p'>{movie.overview}</p>
                      <div className={`popularity-badge popularity-${popularityColor}`}>
                        Popularity: {movie.popularity}%
                      </div>
                      <div className='rating-stars'>
                        <div className='rating-circle'>{movie.voteAverage}/10</div>
                        <div className='star-container'>
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`star ${i < Math.round(movie.voteAverage) ? '' : 'empty'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      {trailers[movie.tmdbId] && (
                        <button
                          onClick={() => openModal(trailers[movie.tmdbId])}
                          className="play-button"
                        >
                          <i className="fa fa-play" style={{ fontSize: '30px', color: '#fff' }}></i>
                          Play Official Trailer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        ) : (
          <div className="no-featured-movies">
            <h2>No Featured Movies Available</h2>
          </div>
        )}
      </div>

      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Trailer Modal"
  className="modal"
  overlayClassName="overlay"
>
  {/* Close Button */}
  <button onClick={closeModal} className="close-button">
    &times;
  </button>

  {/* YouTube Trailer */}
  <iframe
    src={currentTrailer}
    title="Trailer"
    className="trailer-iframe"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</Modal>

      <div className='movies-list'>
        <p className='title-text-movie-lists'>List of Movies</p>
        <div className='list-container'>
          {lists.length > 0 ? (
            lists.map((movie) => (
              <MovieCards
                key={movie.id}
                movie={movie}
                onClick={() => {
                  navigate(`/home/movie/${movie.tmdbId}`);
                  setMovie(movie);
                }}
              />
            ))
          ) : (
            <div className="no-movies">
              <h2>No Movies Available</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
