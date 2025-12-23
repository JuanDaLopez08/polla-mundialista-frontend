import axios from 'axios';

// 1. Obtenemos la URL base desde las variables de entorno (.env)
// Así, si subes esto a producción, solo cambias el archivo .env
const urlBase = import.meta.env.VITE_API_URL;

const clienteAxios = axios.create({
    baseURL: urlBase,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. CONFIGURAR INTERCEPTOR (El Portero)
// Antes de que salga CUALQUIER petición al servidor, este código se ejecuta.
// Su trabajo es buscar si hay un token guardado y pegárselo a la petición.
clienteAxios.interceptors.request.use(config => {
    
    // Intentamos leer el usuario del almacenamiento local
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        
        // Si el usuario tiene un token, lo agregamos a la cabecera "Authorization"
        if (usuario.token) {
            config.headers.Authorization = `Bearer ${usuario.token}`;
        }
    }
    
    return config;
}, error => {
    return Promise.reject(error);
});

export default clienteAxios;