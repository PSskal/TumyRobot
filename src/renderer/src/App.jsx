import { useState, useEffect } from 'react'
import RangeSlider from './components/RangeSlider' // Asegúrate de que la ruta sea correcta
import PortConfig from './components/PortConfig'

const App = () => {
  const [sliderValues, setSliderValues] = useState([45, 45, 45]) // Valores iniciales para los sliders
  const [receivedData, setReceivedData] = useState('')

  const handleSliderChange = (index, newValue) => {
    const newSliderValues = [...sliderValues] // Crea una copia del arreglo
    newSliderValues[index] = newValue // Actualiza el valor del slider correspondiente
    setSliderValues(newSliderValues) // Actualiza el estado
  }

  const combinedValues = sliderValues.join(',') // Combina los valores en una cadena

  const handleConnect = (port, baudRate) => {
    if (window.api && window.api.connectToPort) {
      window.api.connectToPort(port, baudRate)
      console.log(`Conectando al puerto ${port} con baud rate de ${baudRate} principal`)
    } else {
      console.error('window.api no está disponible')
    }
  }

  const handleSendData = (data) => {
    window.api.sendData(data) // Envía datos al Arduino
  }

  useEffect(() => {
    console.log('Valores combinados:', combinedValues)
    handleSendData(combinedValues)
  }, [combinedValues])

  useEffect(() => {
    // Suscribirse al evento de recibir datos
    if (window.api && window.api.onReceiveData) {
      window.api.onReceiveData((data) => {
        console.log('Datos recibidos en el renderer:', data.data)
        setReceivedData(data.data)
      })
    } else {
      console.error('window.api.onReceiveData no está disponible')
    }
  }, []) // El array vacío asegura que el efecto solo se ejecute una vez al montar el componente

  return (
    <>
      {' '}
      <h3
        style={{
          fontSize: '30px', // Tamaño de letra
          paddingBottom: '10px', // Espacio alrededor del texto
          fontWeight: 'bold', // Grosor de la letra (puedes usar 'normal', 'bold' o un número entre 100 y 900)
          fontFamily: 'Arial, sans-serif', // Tipo de letra (puedes cambiar a cualquier fuente)
          color: '#333', // Color del texto (puedes cambiar a cualquier color, hex, rgba, etc.)
          letterSpacing: '4px', // Espaciado entre letras
          textTransform: 'uppercase', // Convierte el texto a mayúsculas
          borderBottom: '2px solid #00dbff', // Línea decorativa debajo del texto
          textAlign: 'center' // Alineación del texto
        }}
      >
        TUMI ROBOT
      </h3>
      <h3
        style={{
          fontSize: '30px', // Tamaño de letra
          paddingBottom: '10px', // Espacio alrededor del texto
          fontWeight: 'bold', // Grosor de la letra (puedes usar 'normal', 'bold' o un número entre 100 y 900)
          fontFamily: 'Arial, sans-serif' // Tipo de letra (puedes cambiar a cualquier fuente)
        }}
      >
        Datos recibidos: {receivedData}
      </h3>
      <div className="container">
        <div>
          <PortConfig onConnect={handleConnect} />
        </div>
        <div className="image-container">
          <img
            src="./src/assets/robotsito2.png" // Reemplaza con la ruta de tu imagen
            alt="Descripción de la imagen"
            className="version-image"
          />
        </div>
        <div className="versions">
          <li>
            <RangeSlider
              nombre="JUNTA 1"
              value={sliderValues[0]} // Pasar el valor correspondiente
              onChange={(value) => handleSliderChange(0, value)} // Manejar el cambio
            />
          </li>
          <li>
            <RangeSlider
              nombre="JUNTA 2"
              value={sliderValues[1]} // Pasar el valor correspondiente
              onChange={(value) => handleSliderChange(1, value)} // Manejar el cambio
            />
          </li>
          <li>
            <RangeSlider
              nombre="JUNTA 3"
              value={sliderValues[2]} // Pasar el valor correspondiente
              onChange={(value) => handleSliderChange(2, value)} // Manejar el cambio
            />
          </li>
        </div>
      </div>
      <h4>PSskal.com</h4>
    </>
  )
}

export default App
