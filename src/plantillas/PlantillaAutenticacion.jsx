import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PlantillaAutenticacion.css';
import { imagenesCarrusel } from '../recursos/imagenes';

const PlantillaAutenticacion = ({ children }) => {
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    if (!imagenesCarrusel || imagenesCarrusel.length === 0) return;
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % imagenesCarrusel.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="auth-container">
      <div className="bg-carousel">
        {imagenesCarrusel.map((img, index) => (
          <div
            key={img}
            className={`bg-slide ${index === indiceActual ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="bg-overlay"></div>
      </div>

      <div className="tarjeta-principal">
        
        {/* LADO IZQUIERDO: Marca y Motivación */}
        <div className="columna-izquierda">
          
          {/* 1. Header de Marca (Arriba) */}
          <div className="encabezado-marca">
            <h1 className="titulo-app">POLLA MUNDIALISTA</h1>
            <span className="subtitulo-fifa">Copa Mundial de la FIFA 2026™</span>
          </div>
          
          {/* 2. Bloque Central (Perfectamente centrado ahora) */}
          <div className="contenido-central">
            <h2>ALCANZA LA<br />GLORIA ETERNA</h2>
            <p>
              Demuestra quién sabe más de fútbol, acierta los marcadores y 
              supera a tus amigos para llevarte el gran premio.
            </p>
            <div className="barra-decorativa"></div>
          </div>

          {/* Elemento vacío para balancear el flex (opcional, ayuda al centrado visual) */}
          <div></div> 
        </div>

        {/* LADO DERECHO: Login */}
        <div className="columna-derecha">
            {children}
        </div>

      </div>
    </div>
  );
};

PlantillaAutenticacion.propTypes = {
  children: PropTypes.node.isRequired
};

export default PlantillaAutenticacion;