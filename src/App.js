import * as React from 'react';
// import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './pages/Public/Login/Login';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Main from './pages/Main/Main';
import Register from './pages/Public/Register/Register';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Movies from './pages/Main/Movie/Movie';
import MovieLists from './pages/Main/Movie/Lists/Lists';
import MovieForm from './pages/Main/Movie/Form/Form';
import Casts from './pages/Main/Movie/Form/Cast/Cast';
import Videos from './pages/Main/Movie/Form/Video/Videos';
import Photos from './pages/Main/Movie/Form/Photo/Photos';
import { AuthProvider } from './context/context';
import Client from './pages/Client/Client';
import Home from './pages/Client/Home/Home';
import Movie from './pages/Client/Movie/MovieView';

//ADT313 MOVIE PROJECT: (+NETMOVIES)
//Submitted by: Romce Angelo R. Cañete BSIT-3A


const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: 'admin/login',
    element: <Login />,
  },
  {
    path: 'admin/register',
    element: <Register />,
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: '/main/dashboard',
        element: <Dashboard />
      },
      {
        path: '/main/movies',
        element: <Movies />,
        children: [
          {
            path: '/main/movies',
            element: <MovieLists />,
          },
          {
            path: '/main/movies/form/:id?',
            element: <MovieForm />,
            children: [
              {
                path: '/main/movies/form/:id',
                element: <Casts />
              },
              {
                path: '/main/movies/form/:id/cast-and-crews/:movieId?',
                element: <Casts />
              },
              {
                path: '/main/movies/form/:id/photos/:movieId?',
                element: <Photos />
              },
              {
                path: '/main/movies/form/:id/videos/:movieId?',
                element: <Videos />
              },
            ]
          },
        ]
      },
      // {
      //   path: '/main/dashboard',
      //   element: <Dashboard />,
      // },
    ],
  },
  {
    path: '/home',
    element: <Client />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/home/movie/:movieId?',
        element: <Movie />
      }
    ]
  },
]);

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;