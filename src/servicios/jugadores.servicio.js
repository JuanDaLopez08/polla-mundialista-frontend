import clienteAxios from '../configuracion/clienteAxios';

/**
 * Obtener todos los jugadores
 * Backend: PrediccionEspecialController -> GET /api/especiales/jugadores
 */
export const obtenerJugadores = async () => {
    try {
        const { data } = await clienteAxios.get('/especiales/jugadores');
        return data;
    } catch (error) {
        console.error("Error obteniendo la lista de jugadores:", error);
        throw error;
    }
};

/**
 * Crear un nuevo jugador
 * Backend: AdminController -> POST /api/admin/crear-jugador
 * Body: { nombre, equipoId }
 */
export const crearJugador = async (nombre, equipoId) => {
    try {
        const { data } = await clienteAxios.post('/admin/crear-jugador', {
            nombre,
            equipoId
        });
        return data;
    } catch (error) {
        console.error("Error creando jugador:", error);
        throw error;
    }
};

/**
 * Actualizar nombre de un jugador
 * Backend: AdminController -> PUT /api/admin/actualizar-jugador/{id}
 * Body: { nombre }
 */
export const actualizarJugador = async (jugadorId, nombre) => {
    try {
        const { data } = await clienteAxios.put(`/admin/actualizar-jugador/${jugadorId}`, {
            nombre
        });
        return data;
    } catch (error) {
        console.error(`Error actualizando jugador ${jugadorId}:`, error);
        throw error;
    }
};