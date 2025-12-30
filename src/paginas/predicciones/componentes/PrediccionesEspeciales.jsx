import { useState, useEffect } from 'react';
import { Save, Trophy, Medal, User, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { 
    obtenerEquipos, 
    obtenerJugadores, 
    obtenerMisEspeciales, 
    guardarCampeon, 
    guardarGoleador 
} from '../../../servicios/prediccionesService';
import '../Predicciones.css';

const PrediccionesEspeciales = ({ usuarioId, notificar }) => {
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  
  const [campeonId, setCampeonId] = useState('');
  const [goleadorId, setGoleadorId] = useState('');
  
  // Estados de Bloqueo (Si ya guardó en BD)
  const [campeonLocked, setCampeonLocked] = useState(false);
  const [goleadorLocked, setGoleadorLocked] = useState(false);
  
  const [loading, setLoading] = useState(true);

  // --- ESTADO DEL MODAL ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    tipo: '', // 'CAMPEON' | 'GOLEADOR'
    idSeleccionado: '',
    nombreSeleccionado: ''
  });

  useEffect(() => {
    if (usuarioId) cargarDatos();
    // eslint-disable-next-line
  }, [usuarioId]);

  const cargarDatos = async () => {
    try {
      const [listaEquipos, listaJugadores, misEspeciales] = await Promise.all([
        obtenerEquipos(),
        obtenerJugadores(),
        obtenerMisEspeciales(usuarioId)
      ]);

      setEquipos(listaEquipos);
      setJugadores(listaJugadores);

      if (misEspeciales) {
        if (misEspeciales.equipoCampeon?.id) {
            setCampeonId(String(misEspeciales.equipoCampeon.id)); 
            setCampeonLocked(true);
        }
        if (misEspeciales.jugadorGoleador?.id) {
            setGoleadorId(String(misEspeciales.jugadorGoleador.id)); 
            setGoleadorLocked(true);
        }
      }
    } catch (error) {
      console.error("Error cargando especiales:", error);
      if(notificar) notificar("Error cargando datos", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- 1. ABRIR MODAL ---
  const confirmarGuardado = (tipo) => {
    if (tipo === 'CAMPEON') {
        const equipo = equipos.find(e => String(e.id) === String(campeonId));
        if (!equipo) return;
        setModalConfig({
            isOpen: true,
            tipo: 'CAMPEON',
            idSeleccionado: campeonId,
            nombreSeleccionado: equipo.nombre
        });
    } else if (tipo === 'GOLEADOR') {
        const jugador = jugadores.find(j => String(j.id) === String(goleadorId));
        if (!jugador) return;
        setModalConfig({
            isOpen: true,
            tipo: 'GOLEADOR',
            idSeleccionado: goleadorId,
            nombreSeleccionado: jugador.nombre
        });
    }
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, tipo: '', idSeleccionado: '', nombreSeleccionado: '' });
  };

  // --- 2. EJECUTAR GUARDADO INDIVIDUAL ---
  const ejecutarGuardado = async () => {
    const { tipo, idSeleccionado } = modalConfig;
    cerrarModal(); // Cerramos modal primero

    try {
        if (tipo === 'CAMPEON') {
            await guardarCampeon({ usuarioId, equipoId: idSeleccionado });
            setCampeonLocked(true);
            if(notificar) notificar("¡Campeón guardado exitosamente!", "exito");
        } else if (tipo === 'GOLEADOR') {
            await guardarGoleador({ usuarioId, jugadorId: idSeleccionado });
            setGoleadorLocked(true);
            if(notificar) notificar("¡Goleador guardado exitosamente!", "exito");
        }
    } catch (error) {
        console.error(`Error guardando ${tipo}:`, error);
        if(notificar) notificar("Error al guardar la selección.", "error");
    }
  };

  // Helpers visuales
  const equipoSeleccionado = equipos.find(e => String(e.id) === String(campeonId));
  const jugadorSeleccionado = jugadores.find(j => String(j.id) === String(goleadorId));

  if (loading) return <div className="loading-msg">Cargando opciones...</div>;

  return (
    <div className="especiales-container animate-fade-in">
      
      <div className="especiales-grid">
        
        {/* === CARD CAMPEÓN === */}
        <div className={`special-card ${campeonLocked ? 'locked-card' : ''}`}>
          <div className="special-header">
            <Trophy className="icon-gold" size={32} />
            <h3>Campeón del Mundo</h3>
            {campeonLocked && <div className="locked-badge"><Lock size={12}/> Registrado</div>}
          </div>
          
          <div className="special-preview">
            {equipoSeleccionado ? (
                <img src={equipoSeleccionado.urlEscudo} alt="Escudo" className="preview-img zoom-in" />
            ) : (
                <div className="preview-placeholder"><Trophy size={40} /></div>
            )}
          </div>

          <div className="custom-select-wrapper">
            <select 
                className="neon-select"
                value={campeonId}
                onChange={(e) => setCampeonId(e.target.value)}
                disabled={campeonLocked}
            >
                <option value="">-- Selecciona Campeón --</option>
                {equipos.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                ))}
            </select>
            {!campeonLocked && <div className="select-arrow">▼</div>}
          </div>

          {/* BOTÓN INDIVIDUAL CAMPEÓN */}
          {!campeonLocked && (
              <button 
                className="btn-card-action"
                disabled={!campeonId}
                onClick={() => confirmarGuardado('CAMPEON')}
              >
                <Save size={16} /> GUARDAR
              </button>
          )}
        </div>

        {/* === CARD GOLEADOR === */}
        <div className={`special-card ${goleadorLocked ? 'locked-card' : ''}`}>
          <div className="special-header">
            <Medal className="icon-silver" size={32} />
            <h3>Bota de Oro</h3>
            {goleadorLocked && <div className="locked-badge"><Lock size={12}/> Registrado</div>}
          </div>

          <div className="special-preview">
             {jugadorSeleccionado?.urlFoto ? (
                 <img src={jugadorSeleccionado.urlFoto} alt="Jugador" className="preview-img zoom-in" />
             ) : (
                 <div className="preview-placeholder"><User size={40} /></div>
             )}
          </div>

          <div className="custom-select-wrapper">
            <select 
                className="neon-select"
                value={goleadorId}
                onChange={(e) => setGoleadorId(e.target.value)}
                disabled={goleadorLocked}
            >
                <option value="">-- Selecciona Goleador --</option>
                {jugadores.map(j => (
                    <option key={j.id} value={j.id}>{j.nombre} ({j.equipo?.nombre})</option>
                ))}
            </select>
            {!goleadorLocked && <div className="select-arrow">▼</div>}
          </div>

          {/* BOTÓN INDIVIDUAL GOLEADOR */}
          {!goleadorLocked && (
              <button 
                className="btn-card-action"
                disabled={!goleadorId}
                onClick={() => confirmarGuardado('GOLEADOR')}
              >
                <Save size={16} /> GUARDAR
              </button>
          )}
        </div>

      </div>

      {/* === MODAL DE CONFIRMACIÓN === */}
      {modalConfig.isOpen && (
        <div className="cyber-modal-overlay">
            <div className="cyber-modal-content">
                <div className="modal-icon-wrapper">
                    <AlertTriangle size={50} color="#00f2ff" />
                </div>
                <h3>CONFIRMAR SELECCIÓN</h3>
                <p>
                    Vas a elegir a <strong style={{color:'#00f2ff'}}>{modalConfig.nombreSeleccionado}</strong> <br/>
                    como tu predicción para {modalConfig.tipo === 'CAMPEON' ? 'Campeón' : 'Goleador'}.
                </p>
                <p style={{fontSize:'0.85rem', color:'#ef4444'}}>
                    ⚠️ Esta acción no se puede deshacer.
                </p>
                
                <div className="modal-actions">
                    <button className="btn-modal btn-cancel" onClick={cerrarModal}>
                        Cancelar
                    </button>
                    <button className="btn-modal btn-confirm" onClick={ejecutarGuardado}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default PrediccionesEspeciales;