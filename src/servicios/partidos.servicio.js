import clienteAxios from '../configuracion/clienteAxios';

// ✅ CORREGIDO: Exportación nombrada para que AdminResultados la pueda encontrar
export const obtenerPartidos = async () => {
  try {
    const { data } = await clienteAxios.get('/partidos');
    return data; 
  } catch (error) {
    console.error("Error al obtener la lista de partidos:", error);
    throw error;
  }
};

export const obtenerPartidoPorId = async (id) => {
  try {
    const { data } = await clienteAxios.get(`/partidos/${id}`);
    return data;
  } catch (error) {
    console.error(`Error al obtener el partido ${id}:`, error);
    throw error;
  }
};