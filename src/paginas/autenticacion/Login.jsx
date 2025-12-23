import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import PlantillaAutenticacion from '../../plantillas/PlantillaAutenticacion';
import InputGlass from '../../componentes/interfaz/InputGlass';
import BotonNeon from '../../componentes/interfaz/BotonNeon';
import './Login.css';

const Login = () => {
  const [formulario, setFormulario] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const { iniciarSesion } = useAutenticacion();
  const navegar = useNavigate();
  const location = useLocation();

  // EFECTO: Revisar si venimos redirigidos del Registro
  useEffect(() => {
    if (location.state?.mensajeExito) {
      setMensajeExito(location.state.mensajeExito);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
    if (error) setError('');
    if (mensajeExito) setMensajeExito('');
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setMensajeExito(''); 
    
    try {
      // 1. Iniciar sesión y obtener respuesta del backend
      const respuesta = await iniciarSesion(formulario.username, formulario.password);
      
      // 2. Verificar Rol para redirigir
      // Ajustamos a tu DB: Buscamos 'ROLE_ADMIN' en el array de roles
      const roles = respuesta.roles || respuesta.usuario?.roles || [];
      const esAdmin = roles.includes('ROLE_ADMIN');

      if (esAdmin) {
         navegar('/admin', { replace: true });
      } else {
         navegar('/panel', { replace: true });
      }

    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas o error de conexión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <PlantillaAutenticacion>
      <form className="formulario-login" onSubmit={manejarEnvio}>
        
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h3 style={{ color: 'white', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
            INICIAR SESIÓN
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Ingresa a tu cuenta</p>
        </div>

        {mensajeExito && (
          <div className="alerta-exito">
            {mensajeExito}
          </div>
        )}

        <InputGlass 
          label="Usuario" nombre="username" valor={formulario.username} 
          alCambiar={manejarCambio} placeholder="Tu usuario"
        />

        <InputGlass 
          label="Contraseña" tipo="password" nombre="password" valor={formulario.password} 
          alCambiar={manejarCambio} placeholder="••••••••"
        />
        
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Link to="/recuperar" style={{ color: 'var(--neon-cyan)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && <div className="alerta-error" role="alert">{error}</div>}

        <BotonNeon tipo="submit" anchoCompleto={true} cargando={cargando}>
          ENTRAR A JUGAR
        </BotonNeon>

        <div className="pie-form">
          <p>¿Te vas a quedar fuera?</p>
          <Link to="/registro" className="enlace-neon">Crear cuenta</Link>
        </div>
      </form>
    </PlantillaAutenticacion>
  );
};

export default Login;