import React, { useState } from 'react';
import TablasPosiciones from './componentes/TablasPosiciones';
import FixtureGeneral from './componentes/FixtureGeneral'; // Lo haremos luego
import BracketMundial from './componentes/BracketMundial';
import './Mundial.css';

const Mundial = () => {
  const [tabActiva, setTabActiva] = useState('tablas');

  return (
    <div className="mundial-container animate-fade-in">
      <div className="page-header">
        <h1>ASÍ VA EL MUNDIAL</h1>
      </div>

      {/* Pestañas de Navegación */}
      <div className="mundial-tabs">
        <button 
          className={`tab-mundial ${tabActiva === 'tablas' ? 'active' : ''}`}
          onClick={() => setTabActiva('tablas')}
        >
          Fase de Grupos
        </button>
        <button 
          className={`tab-mundial ${tabActiva === 'bracket' ? 'active' : ''}`}
          onClick={() => setTabActiva('bracket')}
        >
          Fases Finales
        </button>
        <button 
          className={`tab-mundial ${tabActiva === 'fixture' ? 'active' : ''}`}
          onClick={() => setTabActiva('fixture')}
        >
          Calendario
        </button>
      </div>

      {/* Contenido Dinámico */}
      <div className="mundial-content">
        {tabActiva === 'tablas' && <TablasPosiciones />}
        {tabActiva === 'bracket' && <BracketMundial />}
        {tabActiva === 'fixture' && <FixtureGeneral />}
      </div>
    </div>
  );
};

export default Mundial;