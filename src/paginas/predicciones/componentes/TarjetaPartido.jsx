import { Save, CheckCircle, XCircle, Lock } from 'lucide-react';

const TarjetaPartido = ({ 
  partido, 
  prediccionInicial, 
  valorTemporal, 
  usuarioId, 
  alCambiar, 
  alGuardarIndividual, 
  notificar 
}) => {
  
  // 1. Valores a mostrar
  const valorLocal = valorTemporal?.golesLocal ?? prediccionInicial?.golesLocalPredicho ?? '';
  const valorVisita = valorTemporal?.golesVisitante ?? prediccionInicial?.golesVisitantePredicho ?? '';

  // 2. Estados
  const esModificado = !!valorTemporal; 
  const yaJugo = new Date() > new Date(partido.fechaPartido);
  const yaPredijo = prediccionInicial !== undefined && prediccionInicial !== null;
  const equiposDefinidos = partido.equipoLocal && partido.equipoVisitante;

  // Bloqueo lógico
  const bloqueado = !equiposDefinidos || yaJugo || (yaPredijo && !esModificado); 

  // ESTADO VISUAL: ¿Debe verse como "Neon/Guardado"?
  // Solo si ya predijo, no ha modificado y los equipos existen (no es TBD)
  const esEstadoGuardado = yaPredijo && !esModificado && equiposDefinidos;

  const imgFallback = "https://cdn-icons-png.flaticon.com/512/16/16363.png";

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
  };

  const handleChange = (tipo, valorInput) => {
    if (bloqueado) {
        if(notificar) notificar("Ya realizaste tu predicción", "error");
        return;
    }
    if (valorInput < 0) return;

    const val = valorInput === '' ? '' : parseInt(valorInput);
    const nuevoLocal = tipo === 'local' ? val : valorLocal;
    const nuevoVisita = tipo === 'visita' ? val : valorVisita;
    
    alCambiar(partido.id, {
      usuarioId,
      partidoId: partido.id,
      golesLocal: nuevoLocal,
      golesVisitante: nuevoVisita
    });
  };

  const handleGuardarClick = () => {
    if (valorLocal === '' || valorVisita === '') {
        if(notificar) notificar("Faltan marcadores", "info");
        return;
    }
    alGuardarIndividual({
        usuarioId,
        partidoId: partido.id,
        golesLocal: valorLocal,
        golesVisitante: valorVisita
    });
  };

  // Clases dinámicas: 
  // 'predicho' -> Activa el estilo Neon Cyan
  // 'unsaved' -> Activa el borde amarillo de "editando"
  // 'locked' -> Solo lo usamos para opacidad si está bloqueado PERO NO predicho (ej. partido viejo)
  const claseTarjeta = `match-card 
    ${esModificado ? 'unsaved' : ''} 
    ${esEstadoGuardado ? 'predicho' : (bloqueado && !esEstadoGuardado ? 'locked' : '')}
  `;

  return (
    <div className={claseTarjeta}>
      
      <div className="match-header">
        <span className="match-date">
            {new Date(partido.fechaPartido).toLocaleDateString()}
        </span>
        
        {/* Badge de Puntos (Solo si ya finalizó el partido real) */}
        {yaPredijo && partido.estado === 'FINALIZADO' && (
             prediccionInicial.puntosGanados > 0 
             ? <span className="badge-acierto"><CheckCircle size={14}/> +{prediccionInicial.puntosGanados} pts</span>
             : <span className="badge-fallo"><XCircle size={14}/> 0 pts</span>
        )}
        
        {/* Candado visual (Solo si está bloqueado por tiempo o falta de equipos) */}
        {bloqueado && !esEstadoGuardado && <Lock size={14} color="#64748b"/>}
      </div>

      <div className="match-body">
        {/* LOCAL */}
        <div className="team-col">
          <img 
            src={partido.equipoLocal?.urlEscudo || imgFallback} 
            onError={(e) => e.target.src = imgFallback} 
            alt="L" className="team-flag" 
          />
          <span className="team-name">{partido.equipoLocal?.nombre || 'TBD'}</span>
        </div>

        {/* CENTRO: INPUTS + ACCIÓN */}
        <div className="center-action">
            {equiposDefinidos ? (
                <>
                    <div className="score-inputs">
                        <input 
                            type="number" className="input-score" placeholder="-" min="0"
                            value={valorLocal}
                            onChange={(e) => handleChange('local', e.target.value)}
                            onKeyDown={handleKeyDown} 
                            disabled={bloqueado}
                        />
                        <span className="divider">-</span>
                        <input 
                            type="number" className="input-score" placeholder="-" min="0"
                            value={valorVisita}
                            onChange={(e) => handleChange('visita', e.target.value)}
                            onKeyDown={handleKeyDown} 
                            disabled={bloqueado}
                        />
                    </div>
                    
                    {/* ZONA DE BOTÓN O MENSAJE */}
                    {!bloqueado ? (
                        <button 
                            className="btn-guardar-partido" 
                            onClick={handleGuardarClick} 
                            title="Guardar este partido"
                        >
                            <Save size={20} />
                        </button>
                    ) : (
                        // Si está bloqueado y predicho, mostramos mensaje Neon
                        esEstadoGuardado ? (
                            <div className="mensaje-marcador-listo">
                                <CheckCircle size={14}/> Guardado
                            </div>
                        ) : null
                    )}
                </>
            ) : (
                <div style={{fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold'}}>
                    Por definir
                </div>
            )}
        </div>

        {/* VISITANTE */}
        <div className="team-col">
          <img 
            src={partido.equipoVisitante?.urlEscudo || imgFallback} 
            onError={(e) => e.target.src = imgFallback} 
            alt="V" className="team-flag" 
          />
          <span className="team-name">{partido.equipoVisitante?.nombre || 'TBD'}</span>
        </div>
      </div>
    </div>
  );
};

export default TarjetaPartido;