import { useState } from 'react'
import './RangeSlider.css' // Asegúrate de tener este archivo para los estilos

const RangeSlider = ({ nombre, value, onChange }) => {
  const handleChange = (event) => {
    const newValue = Number(event.target.value) // Convierte el valor a número
    onChange(newValue) // Llama a la función de cambio con el nuevo valor
  }

  return (
    <div className="range-slider">
      <label htmlFor="slider">
        {nombre}: {value}
      </label>
      <input
        type="range"
        id="slider"
        min="0"
        max="60"
        value={value} // Establece el valor actual
        onChange={handleChange} // Maneja el cambio
      />
      <div className="range">
        <div
          className="range-fill"
          style={{ width: `${(value / 60) * 100}%` }} // Calcula el ancho basado en el valor
        ></div>
      </div>
    </div>
  )
}

export default RangeSlider
