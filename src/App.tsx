import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRouter';

export default function App(): React.JSX.Element {
  return <RouterProvider router={router} />;
}
