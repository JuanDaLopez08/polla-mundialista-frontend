import React, { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, BrainCircuit } from 'lucide-react';
// Importamos la nueva función inteligente
import { obtenerPreguntasAleatorias, obtenerMensajeAleatorio, mensajesAcierto, mensajesError } from './datosTrivia';
import './Trivia.css';

const Trivia = () => {
  
  // 1. ESTADO INICIAL (Carga 10 preguntas aleatorias ÚNICAS desde el banco)
  const [preguntasJuego, setPreguntasJuego] = useState(() => obtenerPreguntasAleatorias(10));

  const [indiceActual, setIndiceActual] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [terminado, setTerminado] = useState(false);
  
  const [feedback, setFeedback] = useState(null); 
  const [mensajeFeedback, setMensajeFeedback] = useState('');
  const [bloquear, setBloquear] = useState(false);

  // 2. REINICIAR (Pide otras 10 nuevas)
  const reiniciarJuego = () => {
    setPreguntasJuego(obtenerPreguntasAleatorias(10));
    setIndiceActual(0);
    setPuntaje(0);
    setTerminado(false);
    setFeedback(null);
    setBloquear(false);
  };

  // 3. RESPONDER
  const manejarRespuesta = (opcionSeleccionada) => {
    if (bloquear) return;
    setBloquear(true);

    const esCorrecta = opcionSeleccionada === preguntasJuego[indiceActual].correcta;

    if (esCorrecta) {
      setPuntaje(prev => prev + 1);
      setFeedback('correcto');
      setMensajeFeedback(obtenerMensajeAleatorio(mensajesAcierto));
    } else {
      setFeedback('incorrecto');
      setMensajeFeedback(obtenerMensajeAleatorio(mensajesError));
    }

    setTimeout(() => {
      if (indiceActual + 1 < preguntasJuego.length) {
        setIndiceActual(prev => prev + 1);
        setFeedback(null);
        setBloquear(false);
      } else {
        setTerminado(true);
      }
    }, 4000); 
  };

  if (!preguntasJuego || preguntasJuego.length === 0) return <div className="loading-screen">Cargando Trivia...</div>;

  return (
    <div className="trivia-wrapper">
      <div className="trivia-content animate-fade-in">
        
        <div className="page-header-container">
            <h1 className="neon-title-large">ZONA TRIVIA</h1>
            <p className="neon-subtitle">Demuestra que no eres un pecho frío.</p>
        </div>

        {!terminado ? (
          <div className="juego-area">
            <div className="progreso-texto">
               Pregunta {indiceActual + 1} de 10
            </div>
            
            <div className="pregunta-card">
              <h2 className="texto-pregunta">{preguntasJuego[indiceActual].pregunta}</h2>
              
              <div className="opciones-grid">
                {preguntasJuego[indiceActual].opciones.map((opcion, idx) => (
                  <button 
                    key={idx} 
                    className={`btn-opcion 
                      ${feedback === 'correcto' && opcion === preguntasJuego[indiceActual].correcta ? 'btn-verde' : ''}
                      ${feedback === 'incorrecto' && opcion === preguntasJuego[indiceActual].correcta ? 'btn-verde-falso' : ''}
                      ${feedback === 'incorrecto' && opcion !== preguntasJuego[indiceActual].correcta && bloquear ? 'btn-rojo-dim' : ''}
                    `}
                    onClick={() => manejarRespuesta(opcion)}
                    disabled={bloquear}
                  >
                    {opcion}
                  </button>
                ))}
              </div>

              {/* Feedback centrado en la tarjeta */}
              {feedback && (
                <div className={`feedback-overlay animate-zoom-in ${feedback}`}>
                   <div className="icon-feedback">
                      {feedback === 'correcto' ? <CheckCircle size={60} /> : <XCircle size={60} />}
                   </div>
                   <h3>{feedback === 'correcto' ? '¡CORRECTO!' : '¡ERROR!'}</h3>
                   <p>{mensajeFeedback}</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="resultado-final animate-zoom-in">
             <BrainCircuit size={80} color="#00f2ff" style={{marginBottom: 20}} />
             <h2>RESULTADO FINAL</h2>
             <div className="score-gigante">
               {puntaje} <span className="de-10">/ 10</span>
             </div>
             
             <p className="mensaje-final">
               {puntaje === 10 ? "¡Nivel DIOS! Deberías ser comentarista." : 
                puntaje >= 8 ? "¡Crack! Se nota que sabes de fútbol." :
                puntaje >= 5 ? "Regular... te falta ver más partidos históricos." :
                "¡Desastroso! Dedícate a otro deporte, amigo."}
             </p>

             <button className="btn-cta-neon" onClick={reiniciarJuego}>
                <RefreshCw size={20} /> Jugar de Nuevo
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Trivia;