import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Importamos estilos
import './estilos/variables.css'
import './estilos/globales.css'

// Importamos el Proveedor de Autenticación
import { ProveedorAutenticacion } from './contextos/AutenticacionContexto.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProveedorAutenticacion>
      <App />
    </ProveedorAutenticacion>
  </React.StrictMode>,
)