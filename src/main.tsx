import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './home.tsx';
import Login from './login.tsx';
import './index.css';
import homeLoader from './loaders/home.loader.ts';
import loginLoader from './loaders/login.loader.ts';

const router = createBrowserRouter([
  {
    path: '/',
    loader: homeLoader,
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />,
    loader: loginLoader,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
