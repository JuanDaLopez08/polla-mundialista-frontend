import clienteAxios from '../configuracion/clienteAxios';

const AutenticacionServicio = {
  
  // 1. Iniciar Sesión
  // Recibe usuario y contraseña, devuelve los datos del usuario + token
  async login(username, password) {
    const respuesta = await clienteAxios.post('/auth/login', {
      username,
      password
    });
    
    // Si la respuesta trae token, lo guardamos en el navegador
    if (respuesta.data.token) {
      localStorage.setItem('usuario', JSON.stringify(respuesta.data));
    }
    
    return respuesta.data;
  },

  // 2. Registrarse
  // Envía los datos al backend para crear un nuevo usuario
  async registro(username, email, password, rol = "user") {
    return await clienteAxios.post('/auth/registro', {
      username,
      email,
      password,
      rol
    });
  },

  // 3. Cerrar Sesión
  // Simplemente borramos el rastro del usuario en el navegador
  logout() {
    localStorage.removeItem('usuario');
  },

  // 4. Obtener usuario actual (sin llamar a la API)
  obtenerUsuarioActual() {
    return JSON.parse(localStorage.getItem('usuario'));
  }
};

export default AutenticacionServicio;