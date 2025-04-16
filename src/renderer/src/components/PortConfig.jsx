import { useState } from 'react'
import PropTypes from 'prop-types'
import './PortConfig.css' // Importa el archivo CSS

const PortConfig = ({ onConnect, onDisconnect }) => {
  const [port, setPort] = useState('COM3')
  const [baudRate, setBaudRate] = useState(9600)
  const [isConnected, setIsConnected] = useState(false)

  const baudRates = [9600, 14400, 19200, 38400, 57600, 115200]

  const handleConnect = () => {
    if (port && baudRate) {
      onConnect(port, baudRate)
      setIsConnected(true) // Cambiar el estado a conectado
    } else {
      alert('Por favor selecciona un puerto y un baud rate')
    }
  }

  const handleDisconnect = () => {
    onDisconnect()
    setIsConnected(false) // Cambiar el estado a desconectado
  }

  return (
    <div className="port-config">
      <h3 style={{ fontSize: '18px', padding: '15px' }}>Configuración del Puerto Serial</h3>

      <label>
        Puerto:
        <input
          type="text"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="Ingrese el puerto (ej. COM3)"
          disabled={isConnected} // Deshabilitar cuando está conectado
        />
      </label>

      <label>
        Baud Rate:
        <select
          value={baudRate}
          onChange={(e) => setBaudRate(e.target.value)}
          disabled={isConnected} // Deshabilitar cuando está conectado
        >
          {baudRates.map((rate) => (
            <option key={rate} value={rate}>
              {rate}
            </option>
          ))}
        </select>
      </label>

      {!isConnected ? (
        <button onClick={handleConnect}>Conectar</button>
      ) : (
        <button onClick={handleDisconnect}>Desconectar</button>
      )}
    </div>
  )
}

PortConfig.propTypes = {
  onConnect: PropTypes.func.isRequired,
  onDisconnect: PropTypes.func.isRequired
}

export default PortConfig
