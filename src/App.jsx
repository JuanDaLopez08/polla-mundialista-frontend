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

// --- PAGINAS DE ADMINISTRACIÓN (NUEVO) ---
import DashboardAdmin from './paginas/admin/DashboardAdmin';

// --- LAYOUTS Y SEGURIDAD ---
import PlantillaPrivada from './plantillas/PlantillaPrivada';
import RutaPrivada from './componentes/seguridad/RutaPrivada';
import RutaAdmin from './componentes/seguridad/RutaAdmin'; // ✅ IMPORTANTE: Seguridad Admin
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
        <Route path="/admin" element={
            <RutaAdmin> {/* ✅ Solo pasa si es ADMIN */}
              <PlantillaPrivada>
                 <DashboardAdmin />
              </PlantillaPrivada>
            </RutaAdmin>
        } />
        
        {/* CATCH ALL (404) */}
        <Route path="*" element={<ManejoRutaNoEncontrada />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;