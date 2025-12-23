import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, Ticket, ArrowRight, Medal, User, Flag, Clock } from 'lucide-react';
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

  // 1. CARGA DE DATOS
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

  // 2. RELOJ LÓGICA
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
      
      {/* HEADER RENOVADO */}
      <header className="panel-header">
  <div>
    <h1 className="saludo">Hola, <span className="usuario-highlight">{usuario?.username}</span></h1>
    {/* Frase motivadora en vez de "resumen" */}
    <p className="subtitulo">El camino a la gloria comienza aquí. 🏆</p>
  </div>
  
  {/* BOTÓN NEÓN */}
  <Link to="/predicciones" className="btn-cta-neon">
    Hacer Predicciones <ArrowRight size={20} strokeWidth={3} />
  </Link>
</header>

      {/* SECCIÓN RELOJ ÉPICO */}
      <section className={`hero-countdown ${yaEmpezo ? 'en-curso' : ''}`}>
        {yaEmpezo ? (
          <div className="estado-vivo">
            <div className="punto-rojo-vivo"></div>
            <h2>MUNDIAL EN CURSO</h2>
          </div>
        ) : (
          <>
            <div className="countdown-header">
               <Clock size={16} /> 
               <h3>FALTA PARA INICIAR</h3>
            </div>
            
            <div className="timer-display">
              <div className="timer-block">
                <span className="time-val">{tiempo.dias}</span>
                <span className="time-label">DÍAS</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-block">
                <span className="time-val">{tiempo.horas}</span>
                <span className="time-label">HRS</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-block">
                <span className="time-val">{tiempo.mins}</span>
                <span className="time-label">MIN</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-block">
                {/* Segundos con efecto especial */}
                <span className="time-val seconds-glow">{tiempo.segs}</span>
                <span className="time-label">SEG</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* GRID (Igual que antes) */}
      <div className="dashboard-grid">
        <div className="column-stack">
          <div className="stat-card">
            <div className="stat-icon-bg morado"><Trophy size={24} color="#bd00ff" /></div>
            <div className="stat-info">
              <span className="stat-label">Mis Puntos</span>
              <h2 className="stat-value">{infoMundial?.misPuntos}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-bg cian"><TrendingUp size={24} color="#00f2ff" /></div>
            <div className="stat-info">
              <span className="stat-label">Ranking Global</span>
              <h2 className="stat-value"># {infoMundial?.miRanking}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-bg verde"><Ticket size={24} color="#10b981" /></div>
            <div className="stat-info">
              <span className="stat-label">Predicciones</span>
              <h2 className="stat-value">{infoMundial?.misPredicciones} / {infoMundial?.totalPartidos}</h2>
            </div>
          </div>
        </div>

        <div className="column-stack">
          <div className="card-especial palo-card">
            <div className="header-card">
              <Flag size={16} /> <span>TU EQUIPO SORTEADO</span>
            </div>
            <div className="contenido-palo">
              {infoMundial?.equipoPalo ? (
                <>
                  <img src={infoMundial.equipoPalo.bandera} alt="Bandera" className="bandera-grande" />
                  <h3>{infoMundial.equipoPalo.nombre}</h3>
                </>
              ) : (
                <p className="texto-vacio">Pendiente de Sorteo</p>
              )}
            </div>
          </div>

          <div className="card-especial vip-card">
            <div className="header-card">
              <Medal size={16} /> <span>TUS FAVORITOS</span>
            </div>
            <div className="lista-vip">
              <div className="item-vip">
                <span className="label-vip">Campeón</span>
                <div className="valor-vip">
                    {infoMundial?.prediccionesEspeciales?.campeon ? (
                      <>
                        <img src={infoMundial.prediccionesEspeciales.campeon.bandera} alt="" className="bandera-mini" />
                        {infoMundial.prediccionesEspeciales.campeon.nombre}
                      </>
                    ) : <span className="dim">--</span>}
                </div>
              </div>
              <div className="item-vip">
                <span className="label-vip">Goleador</span>
                <div className="valor-vip">
                    {infoMundial?.prediccionesEspeciales?.goleador ? (
                      <>
                        <User size={14} color="#00f2ff"/>
                        {infoMundial.prediccionesEspeciales.goleador.nombre}
                      </>
                    ) : <span className="dim">--</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;