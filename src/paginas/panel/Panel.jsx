import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, Ticket, ArrowRight, Crown, Goal, Zap, Clock, Dice5 } from 'lucide-react';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import { obtenerDatosDashboard } from '../../servicios/dashboardService';
import './Panel.css';

const Panel = () => {
  const { usuario } = useAutenticacion();
  
  const [infoMundial, setInfoMundial] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  const [tiempo, setTiempo] = useState({ dias: 0, horas: 0, mins: 0, segs: 0 });
  const [yaEmpezo, setYaEmpezo] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!usuario?.id) return;
      try {
        const datos = await obtenerDatosDashboard(usuario.id, usuario.username);
        setInfoMundial(datos);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la información.');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [usuario]);

  // Reloj
  useEffect(() => {
    if (!infoMundial?.fechaInicio) return;
    const objetivo = new Date(infoMundial.fechaInicio).getTime();
    const intervalo = setInterval(() => {
      const ahora = new Date().getTime();
      const distancia = objetivo - ahora;
      if (distancia < 0) {
        setYaEmpezo(true);
        clearInterval(intervalo);
      } else {
        setTiempo({
          dias: Math.floor(distancia / (1000 * 60 * 60 * 24)),
          horas: Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60)),
          segs: Math.floor((distancia % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(intervalo);
  }, [infoMundial]);

  if (cargando) return <div className="loading-msg">Cargando panel...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="panel-container animate-fade-in">
      
      {/* HEADER */}
      <header className="panel-header">
        <div>
          <h1 className="saludo">Hola, <span className="usuario-highlight">{usuario?.username}</span></h1>
          <p className="subtitulo">El camino a la gloria comienza aquí. 🏆</p>
        </div>
        <Link to="/predicciones" className="btn-cta-panel">
          Hacer Predicciones <ArrowRight size={20} strokeWidth={3} />
        </Link>
      </header>

      {/* RELOJ */}
      <section className={`hero-countdown ${yaEmpezo ? 'en-curso' : ''}`}>
        {yaEmpezo ? (
          <div className="estado-vivo"><div className="punto-rojo-vivo"></div><h2>MUNDIAL EN CURSO</h2></div>
        ) : (
          <>
            <div className="countdown-header"><Clock size={16} /><h3>FALTA PARA INICIAR</h3></div>
            <div className="timer-display">
              <div className="timer-block"><span className="time-val">{tiempo.dias}</span><span className="time-label">DÍAS</span></div>
              <span className="timer-sep">:</span>
              <div className="timer-block"><span className="time-val">{tiempo.horas}</span><span className="time-label">HRS</span></div>
              <span className="timer-sep">:</span>
              <div className="timer-block"><span className="time-val">{tiempo.mins}</span><span className="time-label">MIN</span></div>
              <span className="timer-sep">:</span>
              <div className="timer-block"><span className="time-val seconds-glow">{tiempo.segs}</span><span className="time-label">SEG</span></div>
            </div>
          </>
        )}
      </section>

      {/* GRID PRINCIPAL */}
      <div className="dashboard-grid">
        
        {/* COLUMNA IZQUIERDA: 3 TARJETAS (Puntos, Ranking, Predicciones) */}
        <div className="column-stack left-col">
          
          {/* 1. PUNTOS (Morado) */}
          <div className="card-reglas card-neon-purple">
            <div className="reglas-icon"><Trophy size={32} /></div>
            <div className="reglas-info">
              <span className="reglas-value">+{infoMundial?.misPuntos}</span>
              <span className="reglas-label">MIS PUNTOS</span>
              <p className="reglas-desc">Puntos acumulados totales.</p>
            </div>
          </div>

          {/* 2. RANKING (Cian) */}
          <div className="card-reglas card-neon-cyan">
            <div className="reglas-icon"><TrendingUp size={32} /></div>
            <div className="reglas-info">
              <span className="reglas-value">#{infoMundial?.miRanking}</span>
              <span className="reglas-label">RANKING GLOBAL</span>
              <p className="reglas-desc">Tu posición en la tabla general.</p>
            </div>
          </div>

          {/* 3. PREDICCIONES (Verde) */}
          <div className="card-reglas card-neon-green">
            <div className="reglas-icon"><Ticket size={32} /></div>
            <div className="reglas-info">
              <span className="reglas-value">{infoMundial?.misPredicciones}/{infoMundial?.totalPartidos}</span>
              <span className="reglas-label">PREDICCIONES</span>
              <p className="reglas-desc">Partidos pronosticados.</p>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA */}
        <div className="column-stack right-col">
          
          {/* 1. SUPER TARJETA FAVORITOS (Borde Completo) */}
          <div className="super-card-favoritos">
            <div className="super-header">
                <Crown size={20} color="#fbbf24" /> MIS FAVORITOS
            </div>
            
            <div className="super-body">
                {/* SECCIÓN CAMPEÓN */}
                <div className="champ-section">
                    <span className="label-super">CAMPEÓN</span>
                    {infoMundial?.prediccionesEspeciales?.campeon ? (
                        <div className="champ-display">
                            <h3 className="pais-nombre">{infoMundial.prediccionesEspeciales.campeon.nombre}</h3>
                            <img src={infoMundial.prediccionesEspeciales.campeon.bandera} alt="Bandera" className="bandera-gigante animate-pop" />
                        </div>
                    ) : <span className="pendiente-text">No seleccionado</span>}
                </div>

                <div className="divider-vertical"></div>

                {/* SECCIÓN GOLEADOR */}
                <div className="scorer-section">
                    <span className="label-super">GOLEADOR</span>
                    {infoMundial?.prediccionesEspeciales?.goleador ? (
                        <div className="scorer-display">
                            <span className="icono-botin">👟</span>
                            <span className="jugador-nombre">{infoMundial.prediccionesEspeciales.goleador.nombre}</span>
                        </div>
                    ) : <span className="pendiente-text">No seleccionado</span>}
                </div>
            </div>

            {/* --- AQUÍ ESTÁ LA LEYENDA SUTIL (Igual a Palo) --- */}
            <p className="super-footer-text">
                Estas son tus predicciones estratégicas para ganar puntos extra al final.
            </p>
          </div>

          {/* 2. EL PALO */}
          <div className="palo-card-modern">
            <div className="palo-header">
                <Zap size={18} /> TU PALO
            </div>
            <div className="palo-content">
                <div className="palo-main">
                    {infoMundial?.equipoPalo ? (
                        <>
                           <img src={infoMundial.equipoPalo.bandera} alt="Palo" className="bandera-palo-medium" />
                           <span className="nombre-palo">{infoMundial.equipoPalo.nombre}</span>
                        </>
                    ) : <span className="palo-pendiente">Sorteo Pendiente</span>}
                </div>
                {infoMundial?.equipoPalo && (
                    <div className="badge-palo">
                        <Dice5 size={14} /> ASIGNADO
                    </div>
                )}
            </div>
            <p className="palo-footer-text">
                Ganas puntos extra por cada fase que avance este equipo.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Panel;