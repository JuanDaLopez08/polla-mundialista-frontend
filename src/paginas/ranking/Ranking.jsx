import React, { useState, useEffect } from 'react';
import { List, Grid } from 'lucide-react'; 
import clienteAxios from '../../configuracion/clienteAxios';
import './Ranking.css';

const Ranking = () => {
  const [rankingData, setRankingData] = useState([]);
  const [esFinDelTorneo, setEsFinDelTorneo] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [usuarioActual, setUsuarioActual] = useState(null);
  
  const [pestanaActiva, setPestanaActiva] = useState('general');

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const userStorage = JSON.parse(localStorage.getItem('usuario'));
        setUsuarioActual(userStorage?.username);

        const [resRanking, resTorneo] = await Promise.all([
            clienteAxios.get('/usuarios/ranking-completo'),
            clienteAxios.get('/torneo/es-finalizado')
        ]);
        
        setRankingData(resRanking.data);
        setEsFinDelTorneo(resTorneo.data);

      } catch (error) {
        console.error("Error cargando ranking:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  if (cargando) return <div className="loading-text">Cargando posiciones...</div>;

  const [primero, segundo, tercero, ...resto] = rankingData;

  return (
    <div className="ranking-container animate-fade-in">
      
      {/* SECCIÓN CAMPEÓN */}
      {esFinDelTorneo && primero && (
        <div className="champion-section animate-zoom-in">
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="champion-glow"></div>
            <div className="champion-crown">👑</div>
            <h1 className="champion-title">GRAN CAMPEÓN</h1>
            <div className="champion-avatar">{primero.avatar}</div>
            <h2 className="champion-name">{primero.username}</h2>
            <p className="champion-score">{primero.total} PTS</p>
        </div>
      )}

      {/* ✅ CAMBIO 1: TÍTULO RESTAURADO */}
      <h1 className="neon-title-large">TABLA DE POSICIONES</h1>

      {/* PESTAÑAS */}
      <div className="tabs-container">
        <button 
            className={`tab-btn ${pestanaActiva === 'general' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('general')}
        >
            <List size={18}/> General
        </button>
        <button 
            className={`tab-btn ${pestanaActiva === 'detalle' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('detalle')}
        >
            <Grid size={18}/> Detalle de Puntos
        </button>
      </div>

      {/* VISTA 1: GENERAL */}
      {pestanaActiva === 'general' && (
        <div className="tab-content animate-fade-in">
             <div className="podium-container">
                {segundo && (
                    <div className="podium-item second">
                        <div className="podium-avatar">{segundo.avatar}</div>
                        <div className="podium-bar">
                            <span className="podium-rank">2</span>
                            <span className="podium-name">{segundo.username}</span>
                            <span className="podium-pts">{segundo.total}</span>
                        </div>
                    </div>
                )}
                {primero && (
                    <div className="podium-item first">
                        <div className="crown-icon">👑</div>
                        <div className="podium-avatar">{primero.avatar}</div>
                        <div className="podium-bar">
                            <span className="podium-rank">1</span>
                            <span className="podium-name">{primero.username}</span>
                            <span className="podium-pts rank-black">{primero.total}</span>
                        </div>
                    </div>
                )}
                {tercero && (
                    <div className="podium-item third">
                        <div className="podium-avatar">{tercero.avatar}</div>
                        <div className="podium-bar">
                            <span className="podium-rank">3</span>
                            <span className="podium-name">{tercero.username}</span>
                            <span className="podium-pts">{tercero.total}</span>
                        </div>
                    </div>
                )}
             </div>

             <div className="ranking-list">
                <div className="ranking-header-simple">
                    <span>#</span>
                    <span>Usuario</span>
                    <span style={{textAlign:'right'}}>Puntos</span>
                </div>
                {resto.map((user, index) => (
                    <div key={user.usuarioId} className={`ranking-row-simple ${user.username === usuarioActual ? 'current-user' : ''}`}>
                        <span className="rank-num">{index + 4}</span>
                        <div className="rank-user">
                            <div className="small-avatar">{user.avatar}</div>
                            <span>{user.username}</span>
                        </div>
                        <span className="rank-pts">{user.total}</span>
                    </div>
                ))}
             </div>
        </div>
      )}

      {/* VISTA 2: DETALLE */}
      {pestanaActiva === 'detalle' && (
        <div className="tab-content animate-fade-in">
            <div className="table-responsive">
                <table className="detail-table">
                    <thead>
                        {/* ✅ CAMBIO 2: NOMBRES COMPLETOS CON <br/> */}
                        <tr>
                            <th className="th-sticky">Usuario</th>
                            <th title="Marcador Exacto">Marcador<br/>Exacto</th>
                            <th title="Ganador">Ganador<br/>(1X2)</th>
                            <th title="Marcador Invertido">Marcador<br/>Invertido</th>
                            <th title="Clasificados">Clasificación<br/>A 16avos</th>
                            <th title="Campeón">Campeón<br/>Mundial</th>
                            <th title="Goleador">Goleador<br/>Mundial</th>
                            <th title="Gallo Tapado">Palo Avanza<br/>Siguinte Ronda</th>
                            <th className="th-total">Total<br/>Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankingData.map((user) => (
                            <tr key={user.usuarioId} className={user.username === usuarioActual ? 'tr-current' : ''}>
                                <td className="td-user th-sticky">
                                    <span className="mini-avatar">{user.avatar}</span>
                                    {user.username}
                                </td>
                                <td>{user.exacto}</td>
                                <td>{user.ganador}</td>
                                <td>{user.invertido}</td>
                                <td>{user.clasificados}</td>
                                <td>{user.campeon}</td>
                                <td>{user.goleador}</td>
                                <td>{user.palo}</td>
                                <td className="td-total">{user.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

    </div>
  );
};

export default Ranking;