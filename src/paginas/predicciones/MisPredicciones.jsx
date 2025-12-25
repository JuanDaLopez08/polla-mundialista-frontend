import { useState, useEffect } from 'react';
import { Save, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import { obtenerPartidos, obtenerMisPredicciones, guardarPrediccion, guardarPrediccionesMasivas } from '../../servicios/prediccionesService';
import TarjetaPartido from './componentes/TarjetaPartido';
import PrediccionesEspeciales from './componentes/PrediccionesEspeciales';
import PrediccionClasificados from './componentes/PrediccionClasificados';
import './Predicciones.css';

// --- COMPONENTE DE NOTIFICACIÓN TOAST ---
const Toast = ({ mensaje, tipo }) => {
  if (!mensaje) return null;
  const iconos = {
    exito: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />
  };
  return (
    <div className={`toast-notification toast-${tipo}`}>
      {iconos[tipo] || iconos.info}
      <span>{mensaje}</span>
    </div>
  );
};

// --- HELPER VALIDACIÓN ---
const tienePrediccion = (partido, misPredicciones, cambiosMasivos) => {
  const cambioTemp = cambiosMasivos[partido.id];
  if (cambioTemp) {
    return (cambioTemp.golesLocal !== '' && cambioTemp.golesLocal !== undefined) &&
           (cambioTemp.golesVisitante !== '' && cambioTemp.golesVisitante !== undefined);
  }
  const guardado = misPredicciones[partido.id];
  if (guardado) {
    return guardado.golesLocalPredicho !== null && guardado.golesVisitantePredicho !== null;
  }
  return false;
};

// --- ACORDEÓN ---
const GrupoAcordeon = ({ titulo, partidos, usuarioId, misPredicciones, guardarUno, guardarGrupo, alCambiar, cambiosMasivos, notificar }) => {
  const [abierto, setAbierto] = useState(true);
  const partidosJugables = partidos.filter(p => p.equipoLocal && p.equipoVisitante);
  const grupoCompleto = partidosJugables.length > 0 && partidosJugables.every(p => tienePrediccion(p, misPredicciones, cambiosMasivos));
  const cambiosEnEsteGrupo = partidos.filter(p => cambiosMasivos[p.id]);
  const hayCambiosPendientes = cambiosEnEsteGrupo.length > 0;

  const handleGuardarGrupo = (e) => {
    e.stopPropagation();
    const listaCambios = cambiosEnEsteGrupo.map(p => cambiosMasivos[p.id]);
    guardarGrupo(listaCambios);
  };

  return (
    <div className="grupo-acordeon">
      <div className="grupo-header-acordeon" onClick={() => setAbierto(!abierto)}>
        <div className="grupo-info-header">
            <h2 className="titulo-grupo">GRUPO {titulo}</h2>
            <button 
                className="btn-guardar-grupo"
                disabled={!grupoCompleto || !hayCambiosPendientes}
                onClick={handleGuardarGrupo}
            >
                <Save size={14} /> Guardar Grupo
            </button>
        </div>
        {abierto ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
      
      {abierto && (
        <div className="matches-grid animate-fade-in">
          {partidos.map(partido => (
            <TarjetaPartido 
              key={partido.id} partido={partido} usuarioId={usuarioId}
              prediccionInicial={misPredicciones[partido.id]}
              valorTemporal={cambiosMasivos[partido.id]} 
              alGuardarIndividual={guardarUno}
              alCambiar={alCambiar}
              notificar={notificar}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MisPredicciones = () => {
  const { usuario } = useAutenticacion();
  
  const [partidos, setPartidos] = useState([]);
  const [misPredicciones, setMisPredicciones] = useState({});
  const [cambiosMasivos, setCambiosMasivos] = useState({});
  const [loading, setLoading] = useState(true);
  
  // OPCIONAL: Si quieres que arranque en ESPECIALES cambia esto a 'ESPECIALES'
  const [pestanaActiva, setPestanaActiva] = useState('GRUPOS'); 
  
  const [toast, setToast] = useState({ mensaje: '', tipo: '' });

  const notificar = (mensaje, tipo = 'info') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast({ mensaje: '', tipo: '' }), 3000);
  };

  // --- REORDENAMIENTO DE FASES (ESPECIALES PRIMERO) ---
  const FASES = [
    { id: 'ESPECIALES', label: 'Especiales', keyword: null }, // <--- PRIMERO
    { id: 'GRUPOS', label: 'Fase de Grupos', keyword: 'GRUPO' },
    { id: '16AVOS', label: '16avos', keyword: 'DIECISEISAVOS' },
    { id: 'OCTAVOS', label: 'Octavos', keyword: 'OCTAVOS' },
    { id: 'CUARTOS', label: 'Cuartos', keyword: 'CUARTOS' },
    { id: 'SEMIFINAL', label: 'Semifinal', keyword: 'SEMIFINAL' },
    { id: 'TERCER_PUESTO', label: '3er Puesto', keyword: 'TERCER' },
    { id: 'FINAL', label: 'Final', keyword: 'FINAL' }   // <--- ÚLTIMO
  ];

  useEffect(() => {
    const cargarDatos = async () => {
        if (!usuario?.id) return;
        try {
          const [listaPartidos, listaPredicciones] = await Promise.all([
            obtenerPartidos(),
            obtenerMisPredicciones(usuario.id)
          ]);
          setPartidos(listaPartidos);
          const mapa = {};
          listaPredicciones.forEach(p => { if(p.partido) mapa[p.partido.id] = p; });
          setMisPredicciones(mapa);
        } catch (error) {
          console.error("Error al cargar datos:", error);
          notificar("Error cargando datos", "error");
        } finally {
          setLoading(false);
        }
      };
    cargarDatos();
    // eslint-disable-next-line
  }, [usuario]);

  const guardarUno = async (datos) => {
    try {
      await guardarPrediccion(datos);
      const nuevos = { ...cambiosMasivos };
      delete nuevos[datos.partidoId];
      setCambiosMasivos(nuevos);
      
      setMisPredicciones(prev => ({
        ...prev,
        [datos.partidoId]: { ...prev[datos.partidoId], golesLocalPredicho: datos.golesLocal, golesVisitantePredicho: datos.golesVisitante, id: 'temp' }
      }));
      notificar("¡Predicción guardada!", "exito");
    } catch (error) {
      console.error("Error al guardar uno:", error);
      notificar("No se pudo guardar", "error");
    }
  };

  const alCambiarMarcador = (partidoId, datosNuevos) => {
    setCambiosMasivos(prev => {
        const newState = { ...prev };
        const guardado = misPredicciones[partidoId];
        const norm = (v) => (v === null || v === undefined || v === '') ? '' : String(v);
        const nuevoL = norm(datosNuevos.golesLocal);
        const nuevoV = norm(datosNuevos.golesVisitante);
        const viejoL = norm(guardado?.golesLocalPredicho);
        const viejoV = norm(guardado?.golesVisitantePredicho);
        if (nuevoL === viejoL && nuevoV === viejoV) {
            delete newState[partidoId]; 
        } else {
            newState[partidoId] = datosNuevos;
        }
        return newState;
    });
  };

  const procesarGuardadoMasivo = async (lista) => {
    if (!lista || lista.length === 0) return;
    try {
        setLoading(true);
        await guardarPrediccionesMasivas(lista);
        const nuevosCambios = { ...cambiosMasivos };
        lista.forEach(item => delete nuevosCambios[item.partidoId]);
        setCambiosMasivos(nuevosCambios);
        const listaPredicciones = await obtenerMisPredicciones(usuario.id);
        const mapa = {};
        listaPredicciones.forEach(p => { if(p.partido) mapa[p.partido.id] = p; });
        setMisPredicciones(mapa);
        notificar(`¡Se guardaron ${lista.length} predicciones!`, "exito");
    } catch (error) {
        console.error("Error guardando masivamente:", error);
        notificar("Error guardando masivamente", "error");
    } finally {
        setLoading(false);
    }
  };

  const validarTodoCompleto = () => {
    const faseActual = FASES.find(f => f.id === pestanaActiva);
    if (!faseActual || !faseActual.keyword) return false;
    const partidosFase = partidos.filter(p => {
        const n = p.fase?.nombre?.toUpperCase() || '';
        if (pestanaActiva === 'FINAL') return n === 'FINAL' || n === 'GRAN FINAL';
        return n.includes(faseActual.keyword);
    });
    const jugables = partidosFase.filter(p => p.equipoLocal && p.equipoVisitante);
    if (jugables.length === 0) return false;
    return jugables.every(p => tienePrediccion(p, misPredicciones, cambiosMasivos));
  };

  const todoCompleto = validarTodoCompleto();
  const hayCambiosGlobales = Object.keys(cambiosMasivos).length > 0;

  const renderContenido = () => {
    if (loading) return <div className="loading-msg">Cargando fixture...</div>;
    
    // --- ESPECIALES (Ahora es el primero en la lógica visual, pero el render es el mismo) ---
    if (pestanaActiva === 'ESPECIALES') {
      return (
        <div className="especiales-wrapper animate-fade-in">
          <h2 className="section-divider">CAMPEÓN Y GOLEADOR</h2>
          <PrediccionesEspeciales usuarioId={usuario.id} notificar={notificar} />
          
          <h2 className="section-divider">CLASIFICADOS DE GRUPO</h2>
          <PrediccionClasificados usuarioId={usuario.id} notificar={notificar} />
        </div>
      );
    }

    // --- FASES DE PARTIDOS ---
    const faseActual = FASES.find(f => f.id === pestanaActiva);
    const labelFase = faseActual ? faseActual.label : '';

    const partidosFase = partidos.filter(p => {
        const nombreFase = p.fase?.nombre?.toUpperCase() || '';
        if (pestanaActiva === 'FINAL') return nombreFase === 'FINAL' || nombreFase === 'GRAN FINAL';
        return nombreFase.includes(faseActual.keyword);
    });

    if (partidosFase.length === 0) return <div className="info-msg">No hay partidos.</div>;

    const agrupados = partidosFase.reduce((acc, p) => {
        let key = p.fase.nombre; 
        if (pestanaActiva === 'GRUPOS') {
            key = p.equipoLocal?.grupo?.nombre || "Por Definir";
        }
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {});

    const titulosOrdenados = Object.keys(agrupados).sort();

    return (
        <div className="fases-container">
            <h2 className="section-divider">{labelFase.toUpperCase()}</h2>

            {titulosOrdenados.map(titulo => {
                const partidosDelGrupo = agrupados[titulo].sort((a, b) => new Date(a.fechaPartido) - new Date(b.fechaPartido));
                
                if (pestanaActiva === 'GRUPOS') {
                    return (
                        <GrupoAcordeon 
                            key={titulo} titulo={titulo} partidos={partidosDelGrupo}
                            usuarioId={usuario.id} misPredicciones={misPredicciones}
                            guardarUno={guardarUno} guardarGrupo={procesarGuardadoMasivo}
                            alCambiar={alCambiarMarcador} cambiosMasivos={cambiosMasivos}
                            notificar={notificar} 
                        />
                    );
                }

                return (
                    <div key={titulo} className="grupo-section animate-fade-in">
                        <div className="matches-grid">
                            {partidosDelGrupo.map(partido => (
                                <TarjetaPartido 
                                    key={partido.id} partido={partido} usuarioId={usuario.id}
                                    prediccionInicial={misPredicciones[partido.id]}
                                    valorTemporal={cambiosMasivos[partido.id]} 
                                    alGuardarIndividual={guardarUno} alCambiar={alCambiarMarcador}
                                    notificar={notificar} 
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
  };

  return (
    <div className="predicciones-layout animate-fade-in">
      <div className="toast-container">
        <Toast mensaje={toast.mensaje} tipo={toast.tipo} />
      </div>

      <div className="page-header">
        <h1 className="titulo-neon">Centro de Predicciones</h1>
        <div className="tabs-scroll-container"> 
            <div className="tabs-container">
                {FASES.map(fase => (
                    <button 
                        key={fase.id}
                        className={`tab-btn ${pestanaActiva === fase.id ? 'active' : ''}`} 
                        onClick={() => setPestanaActiva(fase.id)}
                    >
                        {fase.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="contenido-tab">
        {renderContenido()}
      </div>

      {pestanaActiva !== 'ESPECIALES' && (
          <div className="floating-save-bar">
              <button 
                className="btn-save-all" 
                onClick={() => procesarGuardadoMasivo(Object.values(cambiosMasivos))}
                disabled={!todoCompleto || !hayCambiosGlobales}
              >
                <Save size={20} /> GUARDAR TODO
              </button>
          </div>
      )}
    </div>
  );
};

export default MisPredicciones;