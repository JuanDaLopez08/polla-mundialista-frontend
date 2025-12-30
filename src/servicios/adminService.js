import clienteAxios from '../configuracion/clienteAxios';

// ==========================================
// 1. ⚙️ CONFIGURACIÓN (Puntos y Reglas)
// ==========================================

export const obtenerConfiguraciones = async () => {
  try {
    const { data } = await clienteAxios.get('/configuracion/obtener-configuracion-de-puntos');
    return data;
  } catch (error) {
    console.error("Error al obtener configuraciones:", error);
    throw error;
  }
};

export const actualizarConfiguracion = async (clave, nuevoValor) => {
  try {
    const { data } = await clienteAxios.put('/configuracion/editar-valor-de-puntos', { 
        clave, 
        valor: String(nuevoValor) 
    });
    return data;
  } catch (error) {
    console.error(`Error actualizando regla ${clave}:`, error);
    throw error;
  }
};

// ==========================================
// 2. ⚽ GESTIÓN DE RESULTADOS Y LLAVES
// ==========================================

// Registrar Resultado Oficial (Con soporte para penales)
export const registrarResultadoOficial = async (partidoId, golesLocal, golesVisitante, penalesLocal = null, penalesVisitante = null) => {
  try {
    const payload = {
        golesLocal: parseInt(golesLocal),
        golesVisitante: parseInt(golesVisitante),
        golesPenalesLocal: penalesLocal !== null && penalesLocal !== '' ? parseInt(penalesLocal) : null,
        golesPenalesVisitante: penalesVisitante !== null && penalesVisitante !== '' ? parseInt(penalesVisitante) : null
    };

    const { data } = await clienteAxios.put(`/admin/partidos/${partidoId}/registrar-resultado`, payload);
    return data;
  } catch (error) {
    console.error("Error al registrar resultado oficial:", error);
    throw error;
  }
};

// Corregir llave manualmente (Si el bracket automático falla o se necesita ajuste)
export const corregirLlavePartido = async (partidoId, equipoLocalId, equipoVisitanteId) => {
    try {
        const { data } = await clienteAxios.put(`/admin/partidos/${partidoId}/corregir-llave`, {
            equipoLocalId,
            equipoVisitanteId
        });
        return data;
    } catch (error) {
        console.error("Error corrigiendo llave:", error);
        throw error;
    }
};

// ==========================================
// 3. 🎲 SORTEOS (Equipo Palo)
// ==========================================

export const sortearPalos = async () => {
    try {
        const { data } = await clienteAxios.post('/admin/sorteo/palos');
        return data;
    } catch (error) {
        console.error("Error en sorteo de palos:", error);
        throw error;
    }
};

// ==========================================
// 4. 🏆 DEFINICIONES FINALES (GUARDAR)
// ==========================================

export const definirCampeonReal = async (equipoId) => {
  try {
    const { data } = await clienteAxios.post(`/admin/definir-campeon/${equipoId}`);
    return data;
  } catch (error) {
    console.error("Error definiendo campeón real:", error);
    throw error;
  }
};

export const definirGoleadorReal = async (jugadorId) => {
    try {
      const { data } = await clienteAxios.post(`/admin/definir-goleador/${jugadorId}`);
      return data;
    } catch (error) {
      console.error("Error definiendo goleador real:", error);
      throw error;
    }
};

// ==========================================
// 5. ⏳ GESTIÓN DE FASES (Tiempos y Cierres)
// ==========================================

export const obtenerFases = async () => {
    try {
        const { data } = await clienteAxios.get('/admin/fases');
        return data;
    } catch (error) {
        console.error("Error obteniendo fases:", error);
        throw error;
    }
};

export const actualizarFase = async (id, fechaLimite, estado = null) => {
    try {
        const payload = { 
            fechaLimite: fechaLimite // Debe ser formato ISO string
        };
        
        if(estado) {
            payload.estado = estado;
        }

        const { data } = await clienteAxios.put(`/admin/fases/${id}`, payload);
        return data;
    } catch (error) {
        console.error(`Error actualizando fase ${id}:`, error);
        throw error;
    }
};

// ==========================================
// 6. 🔍 CONSULTAR RESULTADOS GUARDADOS (Nuevo)
// ==========================================

/**
 * Obtener los resultados oficiales actuales (Campeón y Goleador) para pintar la UI
 * Backend: TorneoController -> GET /api/torneo/resultados-oficiales
 */
export const obtenerResultadosGuardados = async () => {
    try {
        const { data } = await clienteAxios.get('/torneo/resultados-oficiales');
        return data; 
    } catch (error) {
        // SOLUCIÓN SONARQUBE/ESLINT: 
        // Usamos la variable 'error' en un log (aunque sea warning) para indicar que se manejó la excepción.
        // Esto evita el "unused var" y el "ignore exception".
        console.warn("Info: Aún no hay resultados oficiales definidos o el servidor no responde:", error.message);
        return null;
    }
};