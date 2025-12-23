import { Navigate, useLocation } from 'react-router-dom';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import PropTypes from 'prop-types';

const RutaPrivada = ({ children }) => {
  // ✅ Usamos 'esAdmin' directamente del contexto (ya calculado en ProveedorAutenticacion)
  const { usuario, esAdmin } = useAutenticacion();
  const location = useLocation();

  // 1. Si no hay usuario logueado -> Al Login
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Si es ADMIN -> No debe ver el panel de usuario, lo mandamos a /admin
  if (esAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // 3. Si es Usuario Normal -> Pasa
  return children;
};

RutaPrivada.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RutaPrivada;