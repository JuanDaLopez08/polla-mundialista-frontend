import PropTypes from 'prop-types';
import './InputGlass.css';

const InputGlass = ({ label, tipo = "text", nombre, valor, alCambiar, placeholder, error }) => {
  return (
    <div className="grupo-input-glass">
      {label && <label className="label-glass" htmlFor={nombre}>{label}</label>}
      
      <input
        id={nombre}
        type={tipo}
        name={nombre}
        value={valor}
        onChange={alCambiar}
        placeholder={placeholder}
        className={`input-glass ${error ? 'input-error' : ''}`}
      />
      
      {error && <span className="texto-error">{error}</span>}
    </div>
  );
};

InputGlass.propTypes = {
  label: PropTypes.string,
  tipo: PropTypes.string,
  nombre: PropTypes.string.isRequired,
  valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  alCambiar: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string
};

export default InputGlass;