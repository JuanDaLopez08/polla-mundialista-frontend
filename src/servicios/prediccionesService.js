import clienteAxios from '../configuracion/clienteAxios';

// ==========================================
// 1. ⚽ PARTIDOS Y PREDICCIONES GENERALES
// ==========================================

export const obtenerPartidos = async () => {
  try {
    const { data } = await clienteAxios.get('/partidos');
    return data;
  } catch (error) {
    console.error("Error al obtener partidos:", error);
    throw error;
  }
};

export const obtenerMisPredicciones = async (usuarioId) => {
  try {
    const { data } = await clienteAxios.get(`/predicciones/usuario/${usuarioId}`);
    return data;
  } catch (error) {
    console.error("Error al obtener mis predicciones:", error);
    throw error;
  }
};

export const guardarPrediccion = async (datos) => {
  try {
    const { data } = await clienteAxios.post('/predicciones', datos);
    return data;
  } catch (error) {
    console.error("Error al guardar predicción:", error);
    throw error;
  }
};

export const guardarPrediccionesMasivas = async (listaPredicciones) => {
  try {
    const promesas = listaPredicciones.map(p => clienteAxios.post('/predicciones', p));
    await Promise.all(promesas);
    return true;
  } catch (error) {
    console.error("Error en guardado masivo:", error);
    throw error;
  }
};

// ==========================================
// 2. 📚 RECURSOS COMUNES (EQUIPOS Y JUGADORES)
// ==========================================

export const obtenerEquipos = async () => {
  try {
    const { data } = await clienteAxios.get('/equipos');
    return data;
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    throw error;
  }
};

export const obtenerJugadores = async () => {
  try {
    const { data } = await clienteAxios.get('/especiales/jugadores');
    return data;
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    throw error;
  }
};

// ==========================================
// 3. 🏆 ESPECIALES (CAMPEÓN Y GOLEADOR)
// ==========================================

export const obtenerMisEspeciales = async (usuarioId) => {
  try {
    const { data } = await clienteAxios.get(`/especiales/usuario/${usuarioId}`);
    // Si el back devuelve string vacío o null, lo manejamos
    if (!data) return null; 
    return data;
  } catch (error) {
    // Si es 404 significa que no ha jugado, retornamos null sin error
    if (error.response && error.response.status === 404) return null;
    console.warn("Error obteniendo especiales:", error);
    return null;
  }
};

export const guardarCampeon = async ({ usuarioId, equipoId }) => {
  try {
    const payload = { usuarioId, equipoCampeonId: equipoId };
    const { data } = await clienteAxios.post('/especiales/campeon', payload);
    return data;
  } catch (error) {
    console.error("Error guardando campeón:", error);
    throw error;
  }
};

export const guardarGoleador = async ({ usuarioId, jugadorId }) => {
  try {
    const payload = { usuarioId, jugadorGoleadorId: jugadorId };
    const { data } = await clienteAxios.post('/especiales/goleador', payload);
    return data;
  } catch (error) {
    console.error("Error guardando goleador:", error);
    throw error;
  }
};

// ==========================================
// 4. 📊 CLASIFICADOS (GRUPOS)
// ==========================================

// Consulta específica por grupo (para saber si bloquear un grupo específico)
// ESTA ES LA FUNCIÓN CLAVE QUE PEDISTE
export const obtenerClasificadosPorGrupo = async (usuarioId, grupoId) => {
  try {
    const { data } = await clienteAxios.get(`/predicciones/clasificados/usuario/${usuarioId}/grupo/${grupoId}`);
    return data; // Si llega aquí, es 200 OK y devuelve la predicción
  } catch (error) {
    // Si da 404 (Not Found), significa que NO tiene predicción -> Retornamos null
    if (error.response && error.response.status === 404) {
        return null; 
    }
    // Otros errores
    console.warn(`Error consultando grupo ${grupoId}:`, error);
    return null;
  }
};

// Consulta general (por si se necesita)
export const obtenerMisClasificados = async (usuarioId) => {
  try {
    const { data } = await clienteAxios.get(`/predicciones/clasificados/usuario/${usuarioId}`);
    return data; 
  } catch (error) {
    console.warn("No se encontraron clasificados guardados o error:", error);
    return []; 
  }
};

// Guardar clasificados de UN grupo
export const guardarClasificadosGrupo = async ({ usuarioId, grupoId, equiposIds }) => {
  try {
    const payload = {
        usuarioId,
        grupoId,
        equiposIds // Array de IDs [44, 41]
    };
    const { data } = await clienteAxios.post('/predicciones/clasificados', payload);
    return data;
  } catch (error) {
    console.error("Error guardando clasificados:", error);
    throw error;
  }
};