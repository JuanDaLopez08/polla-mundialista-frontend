import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- PAGINAS PÚBLICAS ---
import Login from './paginas/autenticacion/Login';
import Registro from './paginas/autenticacion/Registro';

// --- PAGINAS PRIVADAS (USUARIOS) ---
import Panel from './paginas/panel/Panel';
import MisPredicciones from './paginas/predicciones/MisPredicciones';
import Mundial from './paginas/mundial/Mundial';
import Ranking from './paginas/ranking/Ranking';
import Rivales from './paginas/rivales/Rivales';
import Reglas from './paginas/reglas/Reglas'; 
import Trivia from './paginas/trivia/Trivia'; 

// --- PAGINAS DE ADMINISTRACIÓN ---
import PanelControl from './paginas/admin/panel-control/PanelControl';
import GestionJugadores from './paginas/admin/jugadores/GestionJugadores';
import GestionEquipos from './paginas/admin/equipos/GestionEquipos';
import AdminSorteo from './paginas/admin/sorteo/AdminSorteo';
import AdminConfig from './paginas/admin/configuracion/AdminConfig';
import AdminDefiniciones from './paginas/admin/definiciones/AdminDefiniciones'; // <--- IMPORT AGREGADO

// (Rutas pendientes)
// import GestionPartidos from './paginas/admin/gestion-partidos/GestionPartidos';
// import AdminUsuarios from './paginas/admin/usuarios/AdminUsuarios';


// --- LAYOUTS Y SEGURIDAD ---
import PlantillaPrivada from './plantillas/PlantillaPrivada';
import RutaPrivada from './componentes/seguridad/RutaPrivada';
import RutaAdmin from './componentes/seguridad/RutaAdmin'; 
import { useAutenticacion } from './hooks/useAutenticacion'; 

// Manejo de error 404 inteligente
const ManejoRutaNoEncontrada = () => {
  const { usuario } = useAutenticacion();
  return <Navigate to={usuario ? "/panel" : "/login"} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* =========================================
            RUTAS PÚBLICAS
           ========================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        
        {/* =========================================
            RUTAS PRIVADAS (USUARIOS)
           ========================================= */}
        
        <Route path="/panel" element={
            <RutaPrivada><PlantillaPrivada><Panel /></PlantillaPrivada></RutaPrivada>
        } />

        <Route path="/predicciones" element={
            <RutaPrivada><PlantillaPrivada><MisPredicciones /></PlantillaPrivada></RutaPrivada>
        } />

        <Route path="/mundial" element={
            <RutaPrivada><PlantillaPrivada><Mundial /></PlantillaPrivada></RutaPrivada>
        } />

        <Route path="/ranking" element={
            <RutaPrivada><PlantillaPrivada><Ranking /></PlantillaPrivada></RutaPrivada>
        } />

        <Route path="/rivales" element={
            <RutaPrivada><PlantillaPrivada><Rivales /></PlantillaPrivada></RutaPrivada>
        } />

        <Route path="/trivia" element={
            <RutaPrivada><PlantillaPrivada><Trivia /></PlantillaPrivada></RutaPrivada>
        } />

        <Route path="/reglas" element={
            <RutaPrivada><PlantillaPrivada><Reglas /></PlantillaPrivada></RutaPrivada>
        } />

        {/* =========================================
            ZONA ADMINISTRATIVA (PROTEGIDA)
           ========================================= */}
        
        {/* Redirección Admin */}
        <Route path="/admin" element={<Navigate to="/admin/panel-control" replace />} />

        {/* 1. Panel de Control (Inicio) */}
        <Route path="/admin/panel-control" element={
            <RutaAdmin>
              <PlantillaPrivada>
                 <PanelControl />
              </PlantillaPrivada>
            </RutaAdmin>
        } />

        {/* 2. Gestión de Jugadores */}
        <Route path="/admin/jugadores" element={
            <RutaAdmin>
              <PlantillaPrivada>
                 <GestionJugadores />
              </PlantillaPrivada>
            </RutaAdmin>
        } />

        {/* 3. Gestión de Equipos */}
        <Route path="/admin/equipos" element={
            <RutaAdmin>
              <PlantillaPrivada>
                 <GestionEquipos />
              </PlantillaPrivada>
            </RutaAdmin>
        } />

        {/* 4. Sorteo de Palos */}
        <Route path="/admin/sorteo" element={
            <RutaAdmin>
              <PlantillaPrivada>
                 <AdminSorteo />
              </PlantillaPrivada>
            </RutaAdmin>
        } />

        {/* 5. Configuración del Sistema */}
        <Route path="/admin/configuracion" element={
            <RutaAdmin>
              <PlantillaPrivada>
                 <AdminConfig />
              </PlantillaPrivada>
            </RutaAdmin>
        } /> 

        {/* 6. Definiciones Finales (NUEVA RUTA ACTIVA) */}
        <Route path="/admin/definiciones" element={
            <RutaAdmin>
              <PlantillaPrivada>
                 <AdminDefiniciones />
              </PlantillaPrivada>
            </RutaAdmin>
        } />

        {/* RUTAS PENDIENTES DE CREAR ARCHIVO */}
        {/* <Route path="/admin/gestion-partidos" element={
            <RutaAdmin><PlantillaPrivada><GestionPartidos /></PlantillaPrivada></RutaAdmin>
        } />
        <Route path="/admin/usuarios" element={
            <RutaAdmin><PlantillaPrivada><AdminUsuarios /></PlantillaPrivada></RutaAdmin>
        } />
        */}
        
        {/* CATCH ALL (404) */}
        <Route path="*" element={<ManejoRutaNoEncontrada />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;