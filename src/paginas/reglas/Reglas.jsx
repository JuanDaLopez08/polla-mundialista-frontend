import React, { useState, useEffect } from 'react';
import { Target, Trophy, Award, AlertCircle, Star, Swords, Calculator, User } from 'lucide-react'; 
import clienteAxios from '../../configuracion/clienteAxios';
import './Reglas.css';

const Reglas = () => {
  const [puntos, setPuntos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerReglas = async () => {
      try {
        const res = await clienteAxios.get('/configuracion/reglas');
        setPuntos(res.data);
      } catch (error) {
        console.error("Error cargando reglas:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerReglas();
  }, []);

  if (cargando) return <div className="loading-screen">Cargando Reglamento...</div>;

  // Valores por defecto
  const pExacto = puntos?.['PUNTOS_EXACTO'] || '-';
  const pGanador = puntos?.['PUNTOS_GANADOR'] || '-';
  const pInvertido = puntos?.['PUNTOS_MARCADOR_INVERTIDO'] || '-';
  const pCampeon = puntos?.['PUNTOS_CAMPEON'] || '-';
  const pGoleador = puntos?.['PUNTOS_GOLEADOR'] || '-';
  const pClasificado = puntos?.['PUNTOS_CLASIFICADO'] || '-';
  const pPalo = puntos?.['PUNTOS_PALO'] || '-';

  return (
    <div className="reglas-container animate-fade-in">
      
      <div className="reglas-header">
        <h1 className="neon-title-large">REGLAMENTO Y PUNTUACIÓN</h1>
        <p className="reglas-subtitle">Conoce cómo sumar puntos y los criterios oficiales de desempate.</p>
      </div>

      {/* --- SECCIÓN 1: SISTEMA DE PUNTOS --- */}
      <section className="reglas-section">
        <h2 className="section-title"><Calculator className="icon-title"/> TABLA DE PUNTOS</h2>
        
        <div className="puntos-grid">
          {/* Marcador Exacto */}
          <div className="card-punto exacto">
            <div className="punto-icon"><Target size={32} /></div>
            <div className="punto-valor">+{pExacto} <span>PTS</span></div>
            <h3 className="punto-titulo">MARCADOR EXACTO</h3>
            <p className="punto-desc">Acertar el resultado exacto del partido.</p>
            <div className="ejemplo-mini">Tu: 2-1 | Real: 2-1</div>
          </div>

          {/* Ganador / Empate */}
          <div className="card-punto ganador">
            <div className="punto-icon"><Award size={32} /></div>
            <div className="punto-valor">+{pGanador} <span>PTS</span></div>
            <h3 className="punto-titulo">GANADOR / EMPATE</h3>
            <p className="punto-desc">Acertar quién gana (o el empate) sin el marcador exacto.</p>
            <div className="ejemplo-mini">Tu: 1-0 | Real: 3-0</div>
          </div>

          {/* Marcador Invertido */}
          <div className="card-punto invertido">
            <div className="punto-icon"><AlertCircle size={32} /></div>
            <div className="punto-valor">+{pInvertido} <span>PTS</span></div>
            <h3 className="punto-titulo">MARCADOR INVERTIDO</h3>
            <p className="punto-desc">Acertar los goles exactos pero al equipo contrario.</p>
            <div className="ejemplo-mini">Tu: 2-1 | Real: 1-2</div>
          </div>

          {/* Clasificado */}
          <div className="card-punto clasificado">
            <div className="punto-icon"><Star size={32} /></div>
            <div className="punto-valor">+{pClasificado} <span>PTS</span></div>
            <h3 className="punto-titulo">POR CLASIFICADO</h3>
            <p className="punto-desc">Por cada uno de tus equipos elegidos que logre superar la Fase de Grupos y llegue a 16avos.</p>
          </div>

          {/* Palo */}
          <div className="card-punto palo">
            <div className="punto-icon"><Trophy size={32} /></div>
            <div className="punto-valor">+{pPalo} <span>PTS</span></div>
            <h3 className="punto-titulo">EL PALO (SORPRESA)</h3>
            <p className="punto-desc">Puntos extra por cada ronda que avance tu "Equipo Palo" elegido.</p>
          </div>

          {/* Goleador (NUEVO) */}
          <div className="card-punto goleador">
            <div className="punto-icon"><User size={32} /></div>
            <div className="punto-valor">+{pGoleador} <span>PTS</span></div>
            <h3 className="punto-titulo">ACERTAR GOLEADOR</h3>
            <p className="punto-desc">Puntos extra al final si acertaste el jugador con más goles (Bota de Oro).</p>
          </div>

          {/* Campeón */}
          <div className="card-punto campeon">
            <div className="punto-icon"><Trophy size={32} /></div>
            <div className="punto-valor">+{pCampeon} <span>PTS</span></div>
            <h3 className="punto-titulo">ACERTAR CAMPEÓN</h3>
            <p className="punto-desc">Bonus final si tu candidato levanta la copa. (También sirve como criterio de desempate).</p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 2: CRITERIOS DE DESEMPATE --- */}
      <section className="reglas-section">
        <h2 className="section-title text-pink"><Swords className="icon-title"/> CRITERIOS DE DESEMPATE</h2>
        <div className="desempate-container">
            <p className="desempate-intro">En caso de empate en puntos totales, el sistema define la posición automáticamente siguiendo este orden jerárquico:</p>
            
            <div className="steps-wrapper">
                {/* CRITERIO 1 */}
                <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                        <h4>Mayor Cantidad de Marcadores Exactos</h4>
                        <p>Prevalece el usuario que haya tenido más puntería exacta.</p>
                    </div>
                </div>

                <div className="step-line"></div>

                {/* CRITERIO 2 */}
                <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                        <h4>Mayor Cantidad de Aciertos a Ganador</h4>
                        <p>Si persiste el empate, gana quien haya acertado más veces al ganador (o empate).</p>
                    </div>
                </div>

                <div className="step-line"></div>

                {/* CRITERIO 3 (NUEVO: CAMPEÓN) */}
                <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                        <h4>Acierto de Campeón</h4>
                        <p>Si ambos tienen los mismos aciertos, gana quien haya elegido correctamente al Campeón del Mundial.</p>
                    </div>
                </div>

                <div className="step-line"></div>

                {/* CRITERIO 4 */}
                <div className="step-item">
                    <div className="step-number">4</div>
                    <div className="step-content">
                        <h4>Fecha de Predicción (El que madruga gana)</h4>
                        <p>Como último recurso, gana el usuario que haya guardado sus predicciones <strong>primero</strong>.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
};

export default Reglas;