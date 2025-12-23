import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../configuracion/clienteAxios';

const TablasPosiciones = () => {
  const [data, setData] = useState({});
  const [misPredicciones, setMisPredicciones] = useState(new Set()); 
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario) return;

        // 1. Peticiones en paralelo: Tabla Oficial + Mis Predicciones
        const [resTablas, resPred] = await Promise.all([
          clienteAxios.get('/torneo/posiciones'),
          // Asegúrate que este endpoint coincida con el de tu PrediccionController
          clienteAxios.get(`/predicciones/clasificados/usuario/${usuario.id}`)
        ]);

        setData(resTablas.data);

        // 2. Extraer IDs de tus equipos elegidos
        // Detectamos si viene como "equipoId" (DTO) o "equipo.id" (Entidad)
        const ids = new Set(resPred.data.map(p => p.equipoId || p.equipo?.id));
        setMisPredicciones(ids);

      } catch (error) {
        console.error("Error cargando tablas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) return <div className="loading-text">Cargando estadísticas...</div>;

  return (
    <div className="tablas-container">
      <div className="grupos-grid">
        {Object.keys(data).sort().map(grupo => (
          <div key={grupo} className="tabla-card animate-fade-in">
            <div className="tabla-header">GRUPO {grupo}</div>
            
            <div className="tabla-body">
              {/* Encabezados */}
              <div className="fila-equipo header-row">
                 <span className="pos-num">#</span>
                 <span className="col-escudo"></span>
                 <span className="col-nombre">Equipo</span>
                 <span className="col-stat" title="Puntos">PTS</span>
                 <span className="col-stat" title="Partidos Jugados">PJ</span>
                 <span className="col-stat" title="Goles a Favor">GF</span>
                 <span className="col-stat" title="Goles en Contra">GC</span>
                 <span className="col-stat" title="Diferencia de Gol">DG</span>
                 <span className="col-racha" style={{justifyContent: 'center'}}>Racha</span>
              </div>

              {/* Datos */}
              {data[grupo].map((eq, index) => (
                <div key={eq.equipoId} className={`fila-equipo ${index < 2 ? 'clasifica' : ''}`}>
                  <span className="pos-num" style={{color: index < 2 ? '#00f2ff' : ''}}>{index + 1}</span>
                  <img src={eq.urlEscudo} alt="" className="col-escudo" />
                  
                  <div className="col-nombre">
                    {eq.nombreEquipo}
                    {/* ★ LÓGICA DE LA ESTRELLA ★ */}
                    {misPredicciones.has(eq.equipoId) && (
                      <span className="marca-usuario" title="Tú pronosticaste este equipo">★</span>
                    )}
                  </div>
                  
                  <span className="col-stat highlight">{eq.puntos}</span>
                  <span className="col-stat">{eq.partidosJugados}</span>
                  <span className="col-stat">{eq.golesFavor}</span>
                  <span className="col-stat">{eq.golesContra}</span>
                  
                  <span className={`col-stat ${eq.diferenciaGoles >= 0 ? 'dg-pos' : 'dg-neg'}`}>
                      {eq.diferenciaGoles > 0 ? `+${eq.diferenciaGoles}` : eq.diferenciaGoles}
                  </span>

                  <div className="col-racha">
                     {eq.resultados?.slice(-3).map((r, i) => (
                        <span key={i} className={`dot-racha racha-${r.toLowerCase()}`}>{r}</span>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* LEYENDA INFERIOR */}
      <div className="leyenda-wrapper">
        <div className="leyenda-item">
           <span className="marca-usuario" style={{fontSize: '1.2rem', marginRight: '8px'}}>★</span>
           <span>= Tu Predicción (Clasificado)</span>
        </div>
        <div className="leyenda-item">
           <span className="dot-racha racha-g" style={{marginRight: '8px'}}>G</span>
           <span>= Ganado</span>
        </div>
        <div className="leyenda-item">
           <span className="dot-racha racha-e" style={{marginRight: '8px'}}>E</span>
           <span>= Empate</span>
        </div>
        <div className="leyenda-item">
           <span className="dot-racha racha-p" style={{marginRight: '8px'}}>P</span>
           <span>= Perdido</span>
        </div>
      </div>
    </div>
  );
};

export default TablasPosiciones;