import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../configuracion/clienteAxios';

// ✅ Asegúrate que la ruta de la imagen sea correcta según tu estructura
import imgTrofeo from '../../../recursos/imagenes/trofeo.png'; 

const MatchCard = ({ num, partido }) => {
  if (!partido) return <div className="bracket-match loading">P{num}</div>;

  const localName = partido.equipoLocal ? partido.equipoLocal.nombre : '...';
  const visitaName = partido.equipoVisitante ? partido.equipoVisitante.nombre : '...';
  const localFlag = partido.equipoLocal?.urlEscudo;
  const visitaFlag = partido.equipoVisitante?.urlEscudo;

  // --- LÓGICA DE PENALES ---
  const huboPenales = partido.golesPenalesLocal != null && partido.golesPenalesVisitante != null;

  // Determinar ganador para resaltar
  const ganaLocal = (partido.golesLocalReal > partido.golesVisitanteReal) || 
                    (huboPenales && partido.golesPenalesLocal > partido.golesPenalesVisitante);
  
  const ganaVisita = (partido.golesVisitanteReal > partido.golesLocalReal) || 
                     (huboPenales && partido.golesPenalesVisitante > partido.golesPenalesLocal);

  // --- NUEVA LÓGICA: FECHA Y LUGAR ---
  const fechaFormato = new Date(partido.fechaPartido).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  const ciudad = partido.estadio?.ciudad || ''; 

  return (
    <div className="bracket-match">
      {/* 🔴 CAMBIO AQUÍ: Header con Info Útil en vez de (PEN) */}
      <div className="bracket-match-header">
          <span className="match-num">P{num}</span>
          <span className="meta-divider">•</span>
          <span className="match-meta">{fechaFormato}</span>
          {ciudad && (
            <>
              <span className="meta-divider">•</span>
              <span className="match-meta city-truncate">{ciudad}</span>
            </>
          )}
      </div>
      
      {/* EQUIPO LOCAL */}
      <div className={`bracket-team ${ganaLocal ? 'winner-highlight' : ''}`}>
         <div className="team-info">
           {localFlag && <img src={localFlag} alt="" />} 
           <span>{localName}</span>
         </div>
         <div className="score-wrapper">
            <span className="score">{partido.golesLocalReal ?? '-'}</span>
            {huboPenales && <span className="penal-score">{partido.golesPenalesLocal}</span>}
         </div>
      </div>
      
      {/* EQUIPO VISITANTE */}
      <div className={`bracket-team ${ganaVisita ? 'winner-highlight' : ''}`}>
         <div className="team-info">
           {visitaFlag && <img src={visitaFlag} alt="" />} 
           <span>{visitaName}</span>
         </div>
         <div className="score-wrapper">
            <span className="score">{partido.golesVisitanteReal ?? '-'}</span>
            {huboPenales && <span className="penal-score">{partido.golesPenalesVisitante}</span>}
         </div>
      </div>
    </div>
  );
};

const BracketMundial = () => {
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    clienteAxios.get('/partidos').then(res => setPartidos(res.data));
  }, []);

  const getMatch = (num) => partidos.find(p => p.numeroPartido === num);

  return (
    <div className="bracket-wrapper animate-fade-in">
       <div className="bracket-container">
        
        {/* IZQUIERDA */}
        <div className="column-round col-16avos left-side">
           <div className="round-title">16avos</div>
           {[74, 77, 73, 75, 83, 84, 81, 82].map(n => <MatchCard key={n} num={n} partido={getMatch(n)} />)}
        </div>
        <div className="column-round col-octavos left-side">
           <div className="round-title">Octavos</div>
           {[89, 90, 93, 94].map(n => <MatchCard key={n} num={n} partido={getMatch(n)} />)}
        </div>
        <div className="column-round col-cuartos left-side">
           <div className="round-title">Cuartos</div>
           {[97, 98].map(n => <MatchCard key={n} num={n} partido={getMatch(n)} />)}
        </div>
        <div className="column-round col-semis left-side">
           <div className="round-title">Semis</div>
           <MatchCard num={101} partido={getMatch(101)} />
        </div>

        {/* CENTRO */}
        <div className="column-round col-final">
           <img src={imgTrofeo} alt="Copa" className="img-trofeo floating" />
           
           <div className="round-title title-final">GRAN FINAL</div>
           <MatchCard num={104} partido={getMatch(104)} />
           
           <div className="round-title title-bronze">3er Puesto</div>
           <MatchCard num={103} partido={getMatch(103)} />
        </div>

        {/* DERECHA */}
        <div className="column-round col-semis right-side">
           <div className="round-title">Semis</div>
           <MatchCard num={102} partido={getMatch(102)} />
        </div>
        <div className="column-round col-cuartos right-side">
           <div className="round-title">Cuartos</div>
           {[99, 100].map(n => <MatchCard key={n} num={n} partido={getMatch(n)} />)}
        </div>
        <div className="column-round col-octavos right-side">
           <div className="round-title">Octavos</div>
           {[91, 92, 95, 96].map(n => <MatchCard key={n} num={n} partido={getMatch(n)} />)}
        </div>
        <div className="column-round col-16avos right-side">
           <div className="round-title">16avos</div>
           {[76, 78, 79, 80, 86, 88, 85, 87].map(n => <MatchCard key={n} num={n} partido={getMatch(n)} />)}
        </div>

       </div>
    </div>
  );
};

export default BracketMundial;