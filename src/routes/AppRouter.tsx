import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Popular from '../pages/movies/Popular';
import Upcoming from '../pages/movies/Upcoming';
import TopRated from '../pages/movies/TopRated';
import NowPlaying from '../pages/movies/NowPlaying';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'movies/popular', element: <Popular /> },
      { path: 'movies/upcoming', element: <Upcoming /> },
      { path: 'movies/top-rated', element: <TopRated /> },
      { path: 'movies/now_playing', element: <NowPlaying /> },
    ],
  },
]);


