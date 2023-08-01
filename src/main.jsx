import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import NuevoRegalo from './pages/NuevoRegalo'
import Index from './pages/Index'
import NuevasParejas from './pages/NuevasParejas'
import ErrorPage from './components/ErrorPage'
import NuevoTeam from './pages/NuevoTeam'
import NuevasPruebas from './pages/NuevasPruebas'
import NuevosRegalos from './pages/NuevoRegalo'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />,
        errorElement: <ErrorPage />
      },
      {
        path: 'regalos/nuevo',
        element: <NuevosRegalos
         />,
        errorElement: <ErrorPage />
      },
      {
        path: 'parejas/nuevo',
        element: <NuevasParejas />,
        errorElement: <ErrorPage />
      },
      {
        path: 'team/nuevo',
        element: <NuevoTeam />,
        errorElement: <ErrorPage />
      },

      {
        path: 'pruebas/nuevo',
        element: <NuevasPruebas />,
        errorElement: <ErrorPage />
      },

    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
