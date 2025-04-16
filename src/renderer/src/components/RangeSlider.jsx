import PropTypes from 'prop-types'
import './RangeSlider.css' // Asegúrate de tener este archivo para los estilos

const RangeSlider = ({ nombre, value, onChange }) => {
  const handleChange = (event) => {
    const newValue = Number(event.target.value) // Convierte el valor a número
    onChange(newValue) // Llama a la función de cambio con el nuevo valor
  }
  const valorMaximo = 360 // Valor máximo para el rango

  return (
    <div className="range-slider">
      <label htmlFor="slider">
        {nombre}: {value}
      </label>
      <input
        type="range"
        id="slider"
        min="0"
        max={valorMaximo} // Valor máximo
        value={value} // Establece el valor actual
        onChange={handleChange} // Maneja el cambio
      />
      <div className="range">
        <div
          className="range-fill"
          style={{ width: `${(value / valorMaximo) * 100}%` }} // Calcula el ancho basado en el valor
        ></div>
      </div>
    </div>
  )
}

// Validación de las props con PropTypes
RangeSlider.propTypes = {
  nombre: PropTypes.string.isRequired, // `nombre` debe ser una cadena y es obligatorio
  value: PropTypes.number.isRequired, // `value` debe ser un número y es obligatorio
  onChange: PropTypes.func.isRequired // `onChange` debe ser una función y es obligatorio
}

export default RangeSlider
