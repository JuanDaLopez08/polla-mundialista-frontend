import { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'lucide-react'; // Importamos el icono de hamburguesa
import Sidebar from '../componentes/navegacion/Sidebar';

const PlantillaPrivada = ({ children }) => {
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505' }}>
      
      {/* 1. SIDEBAR */}
      {/* Le pasamos el estado y la función para cerrarse */}
      <Sidebar 
        estaAbierto={menuAbierto} 
        alCerrar={() => setMenuAbierto(false)} 
      />
      
      {/* 2. CONTENIDO PRINCIPAL */}
      <main style={{ 
        flex: 1, 
        position: 'relative',
        width: '100%',
        marginLeft: 0, // En móvil no hay margen
      }}>

        {/* --- BOTÓN HAMBURGUESA (Solo visible en Móvil) --- */}
        <div className="mobile-header" style={{
             padding: '20px',
             display: 'none', // Oculto en escritorio por defecto
             alignItems: 'center',
             gap: '15px'
        }}>
           <button 
             onClick={() => setMenuAbierto(true)}
             style={{
               background: 'rgba(255,255,255,0.1)',
               border: 'none',
               color: 'white',
               padding: '10px',
               borderRadius: '8px',
               cursor: 'pointer'
             }}
           >
             <Menu size={24} />
           </button>
           <h3 style={{color:'white', margin:0, fontSize:'1rem'}}>FIFA 2026</h3>
        </div>

        {/* Estilos CSS en línea para manejar el responsive del layout */}
        <style>{`
          /* ESCRITORIO (Mayor a 768px) */
          @media (min-width: 769px) {
            main {
              margin-left: 260px !important; /* Dejamos espacio para el sidebar fijo */
            }
          }
          
          /* MÓVIL (Menor a 768px) */
          @media (max-width: 768px) {
            .mobile-header {
              display: flex !important; /* Mostramos el botón */
            }
            main {
              margin-left: 0 !important; /* El contenido ocupa todo el ancho */
            }
          }
        `}</style>
        
        {/* El contenido real de la página */}
        <div style={{ padding: '20px' }}>
          {children}
        </div>

      </main>
    </div>
  );
};

PlantillaPrivada.propTypes = {
  children: PropTypes.node.isRequired
};

export default PlantillaPrivada;