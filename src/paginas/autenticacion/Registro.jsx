import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../hooks/useAutenticacion';
import PlantillaAutenticacion from '../../plantillas/PlantillaAutenticacion';
import InputGlass from '../../componentes/interfaz/InputGlass';
import BotonNeon from '../../componentes/interfaz/BotonNeon';
import './Registro.css';

const Registro = () => {
  const [formulario, setFormulario] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [confirmarPass, setConfirmarPass] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();
  const { registrarse } = useAutenticacion();

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
    // Limpiamos el error apenas el usuario empiece a corregir
    if (error) setError('');
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validación local de contraseñas
    if (formulario.password !== confirmarPass) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);

    try {
      // 2. Llamada al Backend
      await registrarse(formulario.username, formulario.email, formulario.password);
      
      console.log('✅ Usuario registrado con éxito');
      navigate('/login',{
        state:{
            mensajeExito: '¡Cuenta creada exitosamente!'
        }
      });
      
    } catch (err) {
      console.error("❌ Error en registro:", err);

      // 3. Manejo de errores inteligente (Lee lo que responde Spring Boot)
      if (err.response) {
        // Caso A: Tu backend manda un mensaje personalizado (ej: "Error: El email ya existe")
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } 
        // Caso B: Error de validación estándar de Spring (ej: Email mal formado)
        else if (err.response.data && err.response.data.error) {
          setError(`Error del servidor: ${err.response.data.error} (Revisa los datos)`);
        }
        // Caso C: Otro error (404, 500)
        else {
          setError(`Error inesperado (${err.response.status}). Intenta de nuevo.`);
        }
      } else if (err.message) {
        // Error de red (servidor apagado) o del código
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <PlantillaAutenticacion>
      <form className="formulario-registro" onSubmit={manejarRegistro}>
        
        <div className="encabezado-form">
          <h3>CREAR CUENTA</h3>
          <p>Únete a la competencia</p>
        </div>

        {/* 1. Usuario (Ancho completo) */}
        <InputGlass 
          label="Usuario" 
          nombre="username" 
          valor={formulario.username} 
          alCambiar={manejarCambio} 
          placeholder="Ej: Cr7Lover"
        />

        {/* 2. Correo (Ancho completo, debajo del usuario) */}
        <InputGlass 
          label="Correo Electrónico" 
          tipo="email"
          nombre="email" 
          valor={formulario.email} 
          alCambiar={manejarCambio} 
          placeholder="ejemplo@correo.com" 
        />

        {/* 3. Contraseñas (Lado a lado en Grid) */}
        <div className="fila-grid">
          <InputGlass 
            label="Contraseña" 
            tipo="password" 
            nombre="password" 
            valor={formulario.password} 
            alCambiar={manejarCambio} 
            placeholder="••••••"
          />
          <InputGlass 
            label="Confirmar" 
            tipo="password" 
            nombre="confirmar" 
            valor={confirmarPass} 
            alCambiar={(e) => setConfirmarPass(e.target.value)} 
            placeholder="••••••"
          />
        </div>

        {/* Alerta de Error (Roja) */}
        {error && <div className="alerta-error" role="alert">{error}</div>}

        <div className="acciones-form">
          <BotonNeon 
            tipo="submit" 
            anchoCompleto={true} 
            cargando={cargando}
            // Deshabilitamos si falta algún dato
            deshabilitado={!formulario.username || !formulario.email || !formulario.password || !confirmarPass}
          >
            REGISTRARME
          </BotonNeon>
        </div>

        <div className="pie-form">
          <p>¿Te vas a quedar fuera?</p>
          <Link to="/login" className="enlace-neon">
            Inicia Sesión
          </Link>
        </div>
      </form>
    </PlantillaAutenticacion>
  );
};

export default Registro;