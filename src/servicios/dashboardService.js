import clienteAxios from '../configuracion/clienteAxios';

/**
 * Obtiene toda la información necesaria para armar el Dashboard (Panel Principal).
 * Hace 4 peticiones en paralelo para ser eficiente.
 * * @param {number} usuarioId - El ID del usuario logueado.
 * @param {string} username - El nombre de usuario (para buscarlo en el ranking).
 */
export const obtenerDatosDashboard = async (usuarioId, username) => {
  try {
    // 1. Ejecutamos las 4 peticiones al tiempo (Paralelismo)
    const [rankingRes, partidosRes, prediccionesRes, especialesRes] = await Promise.all([
      clienteAxios.get('/usuarios/ranking'),                 // Para saber mi puesto y puntos
      clienteAxios.get('/partidos'),                         // Para saber cuándo inicia y total partidos
      clienteAxios.get(`/predicciones/usuario/${usuarioId}`),// Para saber cuántas llevo
      clienteAxios.get(`/especiales/usuario/${usuarioId}`)   // Para saber mi equipo palo y especiales
    ]);

    // --- A. PROCESAR RANKING Y PUNTOS ---
    const rankingLista = rankingRes.data;
    // Buscamos mi posición en la lista
    const miPosicionIndex = rankingLista.findIndex(u => u.id === usuarioId || u.username === username);
    
    const miRanking = miPosicionIndex !== -1 ? miPosicionIndex + 1 : '-';
    const misPuntos = miPosicionIndex !== -1 ? rankingLista[miPosicionIndex].puntosTotales : 0;

    // --- B. PROCESAR PARTIDOS (FECHAS) ---
    const listaPartidos = partidosRes.data;
    const totalPartidos = listaPartidos.length;
    // Asumimos que la lista viene ordenada por fecha desde el back
    const fechaInicio = totalPartidos > 0 ? listaPartidos[0].fechaPartido : null;

    // --- C. PROCESAR PROGRESO ---
    const misPrediccionesCount = prediccionesRes.data.length;

    // --- D. PROCESAR ESPECIALES (PALO, CAMPEÓN, GOLEADOR) ---
    // Nota: El endpoint puede devolver null o vacío si no ha guardado nada
    const especiales = especialesRes.data || {};

    // Mapeamos los datos del Backend (urlEscudo) a lo que espera el Frontend (bandera)
    
    // 1. Equipo Palo (Sorteado)
    const equipoPalo = especiales.equipoPalo ? {
      nombre: especiales.equipoPalo.nombre,
      bandera: especiales.equipoPalo.urlEscudo
    } : null;

    // 2. Campeón Predicho
    const campeon = especiales.equipoCampeon ? {
      nombre: especiales.equipoCampeon.nombre,
      bandera: especiales.equipoCampeon.urlEscudo
    } : null;

    // 3. Goleador Predicho
    const goleador = especiales.jugadorGoleador ? {
      nombre: especiales.jugadorGoleador.nombre,
      equipo: 'Selección' // El DTO simple a veces no trae el equipo, lo dejamos genérico
    } : null;

    // --- E. RETORNAR OBJETO LIMPIO PARA EL COMPONENTE ---
    return {
      misPuntos: misPuntos || 0, // Aseguramos que no vaya null
      miRanking,
      misPredicciones: misPrediccionesCount,
      totalPartidos,
      fechaInicio,
      equipoPalo,
      prediccionesEspeciales: {
        campeon,
        goleador
      }
    };

  } catch (error) {
    console.error('Error construyendo dashboard:', error);
    throw error; // Lanzamos el error para que el componente muestre la alerta
  }
};