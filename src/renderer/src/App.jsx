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

  // Cambiar el formato de los valores combinados
  const combinedValues = `${sliderValues[0]},${sliderValues[1]},${sliderValues[2]}`

  const handleConnect = (port, baudRate) => {
    if (window.api && window.api.connectToPort) {
      window.api.connectToPort(port, baudRate)
      console.log(`Conectando al puerto ${port} con baud rate de ${baudRate} principal`)
    } else {
      console.error('window.api no está disponible')
    }
  }

  const handleDisconnect = () => {
    if (window.api && window.api.disconnectPort) {
      window.api.disconnectPort()
      console.log('Desconectando del puerto')
    } else {
      console.error('window.api.disconnectPort no está disponible')
    }
  }

  const handleSendData = (data) => {
    window.api.sendData(data) // Envía los datos al microcontrolador
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
      <h3
        style={{
          fontSize: '30px',
          paddingBottom: '10px',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          color: '#333',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          borderBottom: '2px solid #00dbff',
          textAlign: 'center'
        }}
      >
        TUMI ROBOT
      </h3>
      <h3
        style={{
          fontSize: '30px',
          paddingBottom: '10px',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        Datos recibidos: {receivedData}
      </h3>
      <div className="container">
        <div>
          <PortConfig onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </div>
        <div className="image-container">
          <img
            src="./src/assets/robotsito2.png"
            alt="Descripción de la imagen"
            className="version-image"
          />
        </div>
        <div className="versions">
          <li>
            <RangeSlider
              nombre="JUNTA 1"
              value={sliderValues[0]}
              onChange={(value) => handleSliderChange(0, value)}
            />
          </li>
          <li>
            <RangeSlider
              nombre="JUNTA 2"
              value={sliderValues[1]}
              onChange={(value) => handleSliderChange(1, value)}
            />
          </li>
          <li>
            <RangeSlider
              nombre="JUNTA 3"
              value={sliderValues[2]}
              onChange={(value) => handleSliderChange(2, value)}
            />
          </li>
        </div>
      </div>
      <h4>PSskal.com</h4>
    </>
  )
}

export default App
