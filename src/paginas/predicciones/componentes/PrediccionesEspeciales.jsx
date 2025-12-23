import { useState, useEffect } from 'react';
import { Save, Trophy, Medal, User, Lock, CheckCircle } from 'lucide-react';
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
  
  // Estados de Bloqueo
  const [campeonLocked, setCampeonLocked] = useState(false);
  const [goleadorLocked, setGoleadorLocked] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

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
        console.log("Datos Back:", misEspeciales);

        // 1. Validar Campeón (DTO: equipoCampeon)
        // Verificamos si existe el objeto y si tiene ID
        if (misEspeciales.equipoCampeon?.id) {
            setCampeonId(String(misEspeciales.equipoCampeon.id)); // Convertir a String es clave
            setCampeonLocked(true);
        }

        // 2. Validar Goleador (DTO: jugadorGoleador)
        if (misEspeciales.jugadorGoleador?.id) {
            setGoleadorId(String(misEspeciales.jugadorGoleador.id)); // Convertir a String es clave
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

  const handleGuardar = async () => {
    // Calculamos qué vamos a guardar DENTRO de la función
    const guardarC = !campeonLocked && campeonId;
    const guardarG = !goleadorLocked && goleadorId;

    if (!guardarC && !guardarG) return;
    
    setGuardando(true);
    try {
      const promesas = [];

      if (guardarC) promesas.push(guardarCampeon({ usuarioId, equipoId: campeonId }));
      if (guardarG) promesas.push(guardarGoleador({ usuarioId, jugadorId: goleadorId }));

      await Promise.all(promesas);

      if(notificar) notificar("¡Selección guardada con éxito!", "exito");
      
      // Bloquear visualmente
      if (guardarC) setCampeonLocked(true);
      if (guardarG) setGoleadorLocked(true);

    } catch (error) {
      console.error(error);
      if(notificar) notificar("Error al guardar", "error");
    } finally {
      setGuardando(false);
    }
  };

  // Helpers visuales
  const equipoSeleccionado = equipos.find(e => String(e.id) === String(campeonId));
  const jugadorSeleccionado = jugadores.find(j => String(j.id) === String(goleadorId));
  
  // Variables lógicas para la UI (Corrección del error 'guardarG is not defined')
  const todoListo = campeonLocked && goleadorLocked;
  
  // ¿Hay algo nuevo pendiente por guardar?
  // Es decir: (Tengo ID de campeón Y no está bloqueado) O (Tengo ID de goleador Y no está bloqueado)
  const hayCambiosPendientes = (campeonId && !campeonLocked) || (goleadorId && !goleadorLocked);

  if (loading) return <div className="loading-msg">Cargando opciones...</div>;

  return (
    <div className="especiales-container animate-fade-in">
      
      <div className="especiales-grid">
        
        {/* CARD CAMPEÓN */}
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
        </div>

        {/* CARD GOLEADOR */}
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
        </div>

      </div>

      <div className="action-footer">
        {/* CORRECCIÓN SONARQUBE: Invertimos el orden (If true -> Mensaje, Else -> Botón) */}
        {todoListo ? (
            <div className="info-msg" style={{padding: '10px 20px', border:'1px solid #10b981', color: '#10b981', display:'inline-flex', gap:'10px', alignItems:'center'}}>
                <CheckCircle size={20}/> ¡Tus predicciones especiales están listas!
            </div>
        ) : (
            <button 
                className="btn-save-all" 
                onClick={handleGuardar}
                // CORRECCIÓN ESLINT: Usamos la variable calculada 'hayCambiosPendientes'
                // El botón se deshabilita si: está guardando O NO hay cambios pendientes
                disabled={guardando || !hayCambiosPendientes}
            >
                <Save size={20} /> {guardando ? 'GUARDANDO...' : 'GUARDAR SELECCIÓN'}
            </button>
        )}
      </div>

    </div>
  );
};

export default PrediccionesEspeciales;