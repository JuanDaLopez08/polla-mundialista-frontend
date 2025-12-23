import { Navigate } from 'react-router-dom';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import PropTypes from 'prop-types';

const RutaAdmin = ({ children }) => {
  // ✅ Usamos 'esAdmin' y 'cargando' del contexto
  const { usuario, esAdmin, cargando } = useAutenticacion();

  // 0. Esperamos a que cargue la sesión (importante al recargar página)
  if (cargando) {
    return <div style={{color:'white', padding: 20}}>Verificando permisos...</div>;
  }

  // 1. Si no está logueado -> Al Login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si NO es Admin -> Lo devolvemos al panel de usuario
  if (!esAdmin) {
    return <Navigate to="/panel" replace />;
  }

  // 3. Si es Admin -> Pasa al Dashboard
  return children;
};

RutaAdmin.propTypes = {
    children: PropTypes.node.isRequired,
};

export default RutaAdmin;