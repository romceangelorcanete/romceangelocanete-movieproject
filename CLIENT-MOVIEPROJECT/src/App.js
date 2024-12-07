import * as React from 'react';
// import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './pages/Public/Login/Login';
import Register from './pages/Public/Register/Register';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from './context/context';
import Client from './pages/Client/Client';
import Home from './pages/Client/Home/Home';
import MovieView from './pages/Client/Movie/MovieView';

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
    path: '/home',
    element: <Client />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/home/movie/:movieId',
        element: <MovieView />
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