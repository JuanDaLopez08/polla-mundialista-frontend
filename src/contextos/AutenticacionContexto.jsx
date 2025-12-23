import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import AutenticacionServicio from '../servicios/autenticacion.servicio';

// 1. IMPORTAMOS el contexto en lugar de crearlo aquí
import { AutenticacionContexto } from './ContextoAuth';

export const ProveedorAutenticacion = ({ children }) => {
  
  const [usuario, setUsuario] = useState(() => {
    return AutenticacionServicio.obtenerUsuarioActual() || null;
  });

  const iniciarSesion = async (username, password) => {
    const data = await AutenticacionServicio.login(username, password);
    setUsuario(data);
    return data;
  };

  const registrarse = async (username, email, password) => {
    return await AutenticacionServicio.registro(username, email, password);
  };

  const cerrarSesion = () => {
    AutenticacionServicio.logout();
    setUsuario(null);
  };

  const valorContexto = useMemo(() => ({
    usuario,
    esAdmin: usuario?.roles?.includes('ROLE_ADMIN') || false,
    iniciarSesion,
    registrarse,
    cerrarSesion,
    estaAutenticado: !!usuario,
  }), [usuario]);

  // Usamos el contexto importado
  return (
    <AutenticacionContexto.Provider value={valorContexto}>
      {children}
    </AutenticacionContexto.Provider>
  );
};

ProveedorAutenticacion.propTypes = {
  children: PropTypes.node.isRequired,
};

// Ya no exportamos 'AutenticacionContexto' desde aquí, 
// solo exportamos el componente Proveedor por defecto.
export default ProveedorAutenticacion;