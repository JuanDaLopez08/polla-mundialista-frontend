import clienteAxios from '../configuracion/clienteAxios';

/**
 * Obtener todos los equipos ordenados alfabéticamente
 * Backend: GET /api/admin/equipos
 */
export const obtenerEquipos = async () => {
  try {
    const { data } = await clienteAxios.get('/admin/equipos');
    return data;
  } catch (error) {
    console.error("Error al obtener la lista de equipos:", error);
    throw error;
  }
};

/**
 * Actualizar un equipo existente (Nombre, Escudo, EsCandidatoPalo)
 * Backend: PUT /api/admin/actualizar-equipo/{id}
 * DTO esperado: { nombre, urlEscudo, esCandidatoPalo }
 */
export const actualizarEquipo = async (id, datosEquipo) => {
  try {
    const { data } = await clienteAxios.put(`/admin/actualizar-equipo/${id}`, datosEquipo);
    return data;
  } catch (error) {
    console.error(`Error al actualizar el equipo ${id}:`, error);
    throw error;
  }
};

/* ⚠️ NOTA IMPORTANTE:
   En los controladores de Java que me compartiste NO existen endpoints para:
   - Crear Equipo (POST)
   - Eliminar Equipo (DELETE)
   
   Por lo tanto, este servicio solo incluye Listar y Actualizar.
   Si en el futuro agregas esos endpoints en el backend, los agregamos aquí.
*/