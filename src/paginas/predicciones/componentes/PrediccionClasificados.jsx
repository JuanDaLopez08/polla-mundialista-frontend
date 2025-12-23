import { useState, useEffect } from 'react';
import { Save, CheckCircle, Lock } from 'lucide-react';
import { 
    obtenerEquipos, 
    obtenerClasificadosPorGrupo, 
    guardarClasificadosGrupo 
} from '../../../servicios/prediccionesService';
import '../Predicciones.css';

const PrediccionClasificados = ({ usuarioId, notificar }) => {
  const [gruposOrdenados, setGruposOrdenados] = useState([]); 
  const [selecciones, setSelecciones] = useState({}); 
  const [bloqueados, setBloqueados] = useState({}); 

  const [loading, setLoading] = useState(true);
  const [guardandoId, setGuardandoId] = useState(null); 

  useEffect(() => {
    if (usuarioId) cargarDatos();
    // eslint-disable-next-line
  }, [usuarioId]);

  const cargarDatos = async () => {
    try {
      // 1. Obtener equipos y armar estructura de grupos
      const listaEquipos = await obtenerEquipos();
      const mapaGrupos = {};
      
      listaEquipos.forEach(eq => {
        if (eq.grupo) { 
            const nombreGrupo = eq.grupo.nombre;
            const idGrupo = eq.grupo.id;
            
            if (!mapaGrupos[nombreGrupo]) {
                mapaGrupos[nombreGrupo] = { id: idGrupo, nombre: nombreGrupo, equipos: [] };
            }
            mapaGrupos[nombreGrupo].equipos.push(eq);
        }
      });

      // Ordenar Grupos A, B, C...
      const listaOrdenada = Object.values(mapaGrupos).sort((a, b) => 
          a.nombre.localeCompare(b.nombre)
      );
      
      // Ordenar equipos dentro del grupo
      listaOrdenada.forEach(g => {
          g.equipos.sort((a,b) => a.nombre.localeCompare(b.nombre));
      });

      setGruposOrdenados(listaOrdenada);

      // 2. CONSULTAR AL BACKEND EL ESTADO DE CADA GRUPO
      const promesasDeEstado = listaOrdenada.map(grupo => 
          obtenerClasificadosPorGrupo(usuarioId, grupo.id)
      );

      const resultados = await Promise.all(promesasDeEstado);

      // 3. PROCESAR RESPUESTAS (AQUÍ ESTABA EL ERROR, AHORA CORREGIDO)
      const mapaSelecciones = {};
      const mapaBloqueos = {};

      resultados.forEach((respuesta, index) => {
          const grupoActual = listaOrdenada[index];
          const gIdStr = String(grupoActual.id);

          // TU BACKEND DEVUELVE UN ARRAY: [ {equipoId: 1...}, {equipoId: 2...} ]
          if (Array.isArray(respuesta) && respuesta.length > 0) {
              
              // Extraemos solo los IDs
              const ids = respuesta.map(item => item.equipoId);
              
              console.log(`Grupo ${grupoActual.nombre} tiene datos:`, ids);

              // Guardamos y BLOQUEAMOS
              mapaSelecciones[gIdStr] = ids;
              mapaBloqueos[gIdStr] = true; 
          } 
      });

      setSelecciones(mapaSelecciones);
      setBloqueados(mapaBloqueos);

    } catch (error) {
      console.error("Error inicial:", error);
      if(notificar) notificar("Error cargando predicciones", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleEquipo = (grupoId, equipoId) => {
    const gIdStr = String(grupoId);
    if (bloqueados[gIdStr]) return;

    setSelecciones(prev => {
        const seleccionadosActuales = prev[gIdStr] || [];
        const yaSeleccionado = seleccionadosActuales.includes(equipoId);

        if (yaSeleccionado) {
            return { ...prev, [gIdStr]: seleccionadosActuales.filter(id => id !== equipoId) };
        } else {
            if (seleccionadosActuales.length >= 2) {
                if(notificar) notificar("Solo puedes seleccionar 2 equipos", "info");
                return prev;
            }
            return { ...prev, [gIdStr]: [...seleccionadosActuales, equipoId] };
        }
    });
  };

  const handleGuardarGrupo = async (grupoInfo) => {
    const gIdStr = String(grupoInfo.id);
    const seleccionados = selecciones[gIdStr] || [];

    if (seleccionados.length !== 2) {
        if(notificar) notificar(`Selecciona 2 equipos en el Grupo ${grupoInfo.nombre}`, "error");
        return;
    }

    setGuardandoId(grupoInfo.id);
    try {
        await guardarClasificadosGrupo({
            usuarioId,
            grupoId: grupoInfo.id,
            equiposIds: seleccionados
        });
        
        if(notificar) notificar(`Grupo ${grupoInfo.nombre} guardado`, "exito");
        
        // Bloqueo inmediato
        setBloqueados(prev => ({ ...prev, [gIdStr]: true }));

    } catch (error) {
        console.error(error);
        if(notificar) notificar("Error al guardar", "error");
    } finally {
        setGuardandoId(null);
    }
  };

  if (loading) return <div className="loading-msg">Cargando grupos...</div>;

  return (
    <div className="clasificados-container animate-fade-in">
        {gruposOrdenados.map(grupo => {
            const gIdStr = String(grupo.id);
            const seleccionados = selecciones[gIdStr] || [];
            const esBloqueado = bloqueados[gIdStr];
            
            return (
                <div key={grupo.id} className={`grupo-card ${esBloqueado ? 'grupo-bloqueado' : ''}`}>
                    <div className="grupo-header-simple">
                        <h3>GRUPO {grupo.nombre}</h3>
                        {esBloqueado ? (
                            <span className="badge-ok"><Lock size={14}/> Guardado</span>
                        ) : (
                            <span className="contador-seleccion">{seleccionados.length} / 2</span>
                        )}
                    </div>

                    <div className="equipos-grid-mini">
                        {grupo.equipos.map(equipo => {
                            const isSelected = seleccionados.includes(equipo.id);
                            return (
                                <div 
                                    key={equipo.id} 
                                    className={`equipo-selectable ${isSelected ? 'selected' : ''}`}
                                    onClick={() => toggleEquipo(grupo.id, equipo.id)}
                                >
                                    <img src={equipo.urlEscudo} alt={equipo.nombre} className="escudo-mini"/>
                                    <span className="nombre-equipo">{equipo.nombre}</span>
                                    {isSelected && <CheckCircle className="check-icon" size={18}/>}
                                </div>
                            );
                        })}
                    </div>

                    <div className="grupo-footer">
                        {!esBloqueado ? (
                             <button 
                                className="btn-guardar-grupo-full"
                                onClick={() => handleGuardarGrupo(grupo)}
                                disabled={guardandoId === grupo.id}
                             >
                                <Save size={16} /> 
                                {guardandoId === grupo.id ? '...' : 'GUARDAR'}
                             </button>
                        ) : (
                            <div className="mensaje-listo">
                                <CheckCircle size={16}/> Clasificados definidos
                            </div>
                        )}
                    </div>
                </div>
            );
        })}
    </div>
  );
};

export default PrediccionClasificados;