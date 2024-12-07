import React, { useEffect, useContext, useCallback, useState } from 'react';
import { AuthContext } from '../../../context/context';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieView.css';
import CastCards from '../../../components/CastCards/CastCards';
import VideoCards from '../../../components/VideoCards/VideoCards';
import PhotoCards from '../../../components/PhotoCards/PhotoCards';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'; // New component
import Modal from 'react-modal'; // Import react-modal

function Movie() {
  const { auth, movie, setMovie } = useContext(AuthContext);
  const listCast = movie?.casts || [];
  const listVideo = movie?.videos || [];
  const listPhoto = movie?.photos || [];
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);  // Loading state
  const [trailers, setTrailers] = useState({});   // State to hold trailer URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState('');


  Modal.setAppElement('#root');




  const getPopularityColor = (popularity) => {
    if (popularity > 80) return 'red'; // high popularity
    if (popularity > 50) return 'yellow'; // medium popularity
    return 'green'; // low popularity
  };

  const fetchMovie = useCallback(() => {
    if (movieId !== undefined) {
      setLoading(true);  // Set loading true before fetching
      axios({
        method: 'get',
        url: `/movies/${movieId}`,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
        .then((response) => {
          setMovie(response.data);
          fetchTrailer(response.data.tmdbId);  // Fetch trailer after movie data
          setLoading(false);  // Set loading false after data is fetched
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          alert('An error occurred while fetching movie details. Please try again.');
          navigate('/home');
        });
    }
  }, [movieId, auth.accessToken, navigate, setMovie]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

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

  const year = movie?.releaseDate ? movie.releaseDate.slice(0, 4) : 'Unknown Year';

  if (loading) {
    return <LoadingSpinner />;
  }

  const popularityColor = getPopularityColor(movie.popularity);

  return (
    <div className="container-movie-card">
      {movie && (
        <>
          {/* Movie Info Section */}
          <div
            className="Movie-Tab-Info"
            style={{
              backgroundImage: `url(${movie.backdropPath !== 'https://image.tmdb.org/t/p/original/undefined' ? movie.backdropPath : movie.posterPath})`,
            }}
          >
            <div className="background-overlay"></div>
            <div className="banner">
              <img className="View-Movie-Poster" src={movie.posterPath} alt="poster movie" />
            </div>
            <div className="info-movie-flex">
              {/* Play Icon for Official Trailer */}
              {trailers[movie.tmdbId] && (
                        <button
                          onClick={() => openModal(trailers[movie.tmdbId])}
                          className="play-button"
                        >
                          <i className="fa fa-play" style={{ fontSize: '30px', color: '#fff' }}></i>
                          Play Official Trailer
                        </button>
                      )}
              <h1>{movie.title}</h1>
              <div className="movie-year">
                <span>{year}</span>
              </div>
              <hr style={{width:'800px'}} />
              <h3 className="overview-h3">{movie.overview}</h3>
              <div className="movie-info">
                <div className="popularity">
                  <span className="popularity-label">Popularity</span>
                  <span className="popularity-value">{movie.popularity}%</span>
                  <div className="popularity-bar">
                    <div
                      className="popularity-progress"
                      style={{
                        width: `${movie.popularity}%`,
                        backgroundColor: popularityColor,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="rating">
                  <div className="rating-stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`star ${i < Math.round(movie.voteAverage) ? '' : 'empty'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="rating-score">
                    <span>{movie.voteAverage}/10</span>
                  </div>
                </div>
              </div>
            </div>
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

          {/* Cast Section */}
          {listCast && listCast.length ? (
            <div className="Slider-Color">
              <h1 className="Tab-Viewer-h1">Cast & Crew</h1>
              <div className="Slide-Viewer">
                {listCast.map((casts) => (
                  <CastCards key={casts.id} cast={casts} />
                ))}
              </div>
            </div>
          ) : (
            <div className="Slider-Color">
              <h1 className="Tab-Viewer-h1">Cast & Crew</h1>
              <p className="not-found-message">🖼️📷 No photos yet! Let's capture some memories soon!</p>
            </div>
          )}

          {/* Video Section */}
          {listVideo && listVideo.length ? (
            <div className="Slider-Color">
              <h1 className="Tab-Viewer-h1">Videos</h1>
              <div className="Slide-Viewer">
                {listVideo.map((video) => (
                  <VideoCards key={video.id} video={video} />
                ))}
              </div>
            </div>
          ) : (
            <div className="Slider-Color">
              <h1 className="Tab-Viewer-h1">Videos</h1>
              <p className="not-found-message">📽️▶️ No videos yet! Get ready to roll the camera!</p>
            </div>
          )}



          {/* Photos Section */}
          {listPhoto && listPhoto.length ? (
            <div className="Slider-Color">
              <h1 className="Tab-Viewer-h1">Photos</h1>
              <div className="Slide-Viewer">
                {listPhoto.map((photos) => (
                  <PhotoCards
                    key={photos.id}
                    photos={photos}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="Slider-Color">
              <h1 className="Tab-Viewer-h1">Photos</h1>
              <p className="not-found-message">🏝️⛱️ No cast here? Maybe they're enjoying a tropical vacation... 🌊🍹</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Movie;
