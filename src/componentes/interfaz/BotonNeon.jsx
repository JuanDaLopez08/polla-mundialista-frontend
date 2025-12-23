import PropTypes from 'prop-types';
import './BotonNeon.css';

const BotonNeon = ({ children, alHacerClick, tipo = "button", anchoCompleto = false, cargando = false, deshabilitado = false }) => {
  return (
    <button
      type={tipo}
      onClick={alHacerClick}
      disabled={deshabilitado || cargando}
      className={`btn-neon ${anchoCompleto ? 'ancho-completo' : ''} ${deshabilitado ? 'deshabilitado' : ''}`}
    >
      {cargando ? <span className="loader"></span> : children}
    </button>
  );
};

BotonNeon.propTypes = {
  children: PropTypes.node.isRequired,
  alHacerClick: PropTypes.func, // Opcional si es tipo submit
  tipo: PropTypes.oneOf(['button', 'submit', 'reset']),
  anchoCompleto: PropTypes.bool,
  cargando: PropTypes.bool,
  deshabilitado: PropTypes.bool
};

export default BotonNeon;