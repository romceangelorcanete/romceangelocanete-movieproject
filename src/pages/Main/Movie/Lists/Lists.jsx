import { useNavigate } from 'react-router-dom';
import './Lists.css';
import { useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the icons
import { AuthContext } from '../../../../context/context'; // Corrected import


const Lists = () => {
  const navigate = useNavigate();
  const { lists } = useContext(AuthContext);
  const { setListDataMovie } = useContext(AuthContext);
  const { auth } = useContext(AuthContext);

  const getMovies = useCallback(() => {
      // Get the movies from the API or database
      axios.get('/movies').then((response) => {
          setListDataMovie(response.data);
      });
  }, [setListDataMovie]);

  useEffect(() => {
      getMovies();
  }, [getMovies]);

  const handleDelete = (id) => {
      const isConfirm = window.confirm(
          'Are you sure that you want to delete this Movie including the casts, photos and videos on it?'
      );
      if (isConfirm) {
          axios
              .delete(`/movies/${id}`, {
                  headers: {
                      Authorization: `Bearer ${auth.accessToken}`,
                  },
              })
              .then(() => {
                  // Update list by modifying the movie list array
                  const tempLists = [...lists];
                  const index = lists.findIndex((movie) => movie.id === id);
                  if (index !== undefined || index !== -1) {
                      tempLists.splice(index, 1);
                      setListDataMovie(tempLists);
                  }
              }).catch((err) => {
                  console.log(err);
              });
      }
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button
          type="button"
          onClick={() => {
            navigate('/main/movies/form');
          }}
          className="action-button"
        >
          Create New
        </button>
      </div>
      <div className="table-container">
        <table className="movie-lists">
          <thead>
            <tr>
              <th>No.</th>
              <th>ID</th>
              <th>Title</th>
              <th>TMDBID</th>
              <th>Popularity</th>
              <th>Release Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {lists.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    <strong>Movie not found.</strong>
                                </td>
                            </tr>
                        ) : (
            lists.map((movie, index) => (
              <tr key={movie.id}>
                <td>{index + 1}</td>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>{movie.tmdbId}</td>
                <td>{movie.popularity}</td>
                <td>{movie.releaseDate}</td>
                <td>
                  <button
                    className="edit-button"
                    type="button"
                    style={{ width: '30%' }}
                    onClick={() => {
                      navigate(
                          '/main/movies/form/' +
                          movie.id +
                          '/cast-and-crews/' + movie.tmdbId
                      );
                  }}
                  >
                    <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} /> Edit
                  </button>
                  <button
                    className="delete-button"
                    type="button"
                    style={{ width: '30%' }}
                    onClick={() => handleDelete(movie.tmdbId)}
                  >
                    <FontAwesomeIcon icon={faTrash} style={{ marginRight: '8px' }} /> Delete
                  </button>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;
