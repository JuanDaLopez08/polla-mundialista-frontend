import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  LayoutDashboard, Ticket, Globe, Trophy, Swords, BookOpen, LogOut, X, BrainCircuit, // Iconos Usuario
  ClipboardList, Shirt, Gavel, Settings, Users // ✅ Iconos Admin (Users reintegrado)
} from 'lucide-react';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import trofeoImg from '../../recursos/imagenes/trofeo.png'; 
import './Sidebar.css';

const Sidebar = ({ estaAbierto, alCerrar }) => {
  const { usuario, cerrarSesion, esAdmin } = useAutenticacion();
  const navigate = useNavigate();
  const [mostrarCopa, setMostrarCopa] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => setMostrarCopa(p => !p), 4000);
    return () => clearInterval(intervalo);
  }, []);

  const iniciales = usuario?.username ? usuario.username.substring(0, 2).toUpperCase() : 'US';

  const manejarSalida = () => {
    cerrarSesion();
    navigate('/login', { replace: true });
  };

  // --- MENÚ JUGADOR ---
  const menuUsuario = [
    { texto: 'Inicio', ruta: '/panel', icono: <LayoutDashboard size={20} /> },
    { texto: 'Mis Predicciones', ruta: '/predicciones', icono: <Ticket size={20} /> },
    { texto: 'Mundial', ruta: '/mundial', icono: <Globe size={20} /> },
    { texto: 'Ranking', ruta: '/ranking', icono: <Trophy size={20} /> },
    { texto: 'Rivales', ruta: '/rivales', icono: <Swords size={20} /> },
    { texto: 'Zona Trivia', ruta: '/trivia', icono: <BrainCircuit size={20} /> },
    { texto: 'Reglas', ruta: '/reglas', icono: <BookOpen size={20} /> },
  ];

  // --- MENÚ ADMIN (ESTRUCTURA FINAL) ---
  const menuAdmin = [
    { texto: 'Dashboard', ruta: '/admin', icono: <LayoutDashboard size={20} /> },
    
    // Gestión Diaria
    { texto: 'Resultados y Partidos', ruta: '/admin/resultados', icono: <ClipboardList size={20} /> },
    
    // Base de Datos
    { texto: 'Equipos y Jugadores', ruta: '/admin/equipos', icono: <Shirt size={20} /> },
    { texto: 'Usuarios', ruta: '/admin/usuarios', icono: <Users size={20} /> }, // ✅ AQUÍ ESTÁ
    
    // Eventos
    { texto: 'Definiciones', ruta: '/admin/definiciones', icono: <Gavel size={20} /> },
    
    // Sistema
    { texto: 'Configuración', ruta: '/admin/config', icono: <Settings size={20} /> },
  ];

  const itemsParaMostrar = esAdmin ? menuAdmin : menuUsuario;

  return (
    <>
      <div 
        className={`sidebar-overlay ${estaAbierto ? 'visible' : ''}`} 
        onClick={alCerrar}
      />

      <aside className={`sidebar-container ${estaAbierto ? 'abierto' : ''}`}>
        
        <button className="btn-close-mobile" onClick={alCerrar} style={{
          position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'white', display: 'none'
        }}>
           <X />
        </button>

        <div className="sidebar-header">
          <div className="avatar-tech-container">
            {/* Anillo de Poder: Rojo/Dorado si es Admin */}
            <div className={`avatar-tech-ring ${esAdmin ? 'admin-ring' : ''}`}></div>
            <div className="avatar-content">
              <div className={`avatar-slide ${mostrarCopa ? 'show-copa' : 'show-text'}`}>
                <img src={trofeoImg} alt="Copa" className="img-copa" />
                <span className="txt-iniciales">{iniciales}</span>
              </div>
            </div>
          </div>
          <div className="brand-text">
            <h3>{esAdmin ? 'PANEL DE CONTROL' : 'Copa Mundial FIFA'}</h3>
            <h2 className="text-gradient">2026™</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          {itemsParaMostrar.map((item) => (
            <NavLink 
              key={item.ruta} 
              to={item.ruta}
              onClick={alCerrar}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span className="nav-icon">{item.icono}</span>
                  <span className="nav-text">{item.texto}</span>
                  {isActive && <div className="nav-glow"></div>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={manejarSalida} className="btn-logout">
            <LogOut size={20} />
            <span>{esAdmin ? 'Cerrar Admin' : 'Salir'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  estaAbierto: PropTypes.bool,
  alCerrar: PropTypes.func
};

export default Sidebar;