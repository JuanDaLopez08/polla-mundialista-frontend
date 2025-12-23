import { useContext } from 'react';
import { AutenticacionContexto } from '../contextos/ContextoAuth';

export const useAutenticacion = () => {
  const contexto = useContext(AutenticacionContexto);
  
  if (!contexto) {
    throw new Error('useAutenticacion debe usarse dentro de un ProveedorAutenticacion');
  }
  
  return contexto;
};