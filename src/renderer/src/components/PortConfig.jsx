import { useState } from 'react'
import './PortConfig.css' // Importa el archivo CSS

const PortConfig = ({ onConnect }) => {
  const [port, setPort] = useState('')
  const [baudRate, setBaudRate] = useState(9600)

  const baudRates = [9600, 14400, 19200, 38400, 57600, 115200]

  const handleConnect = () => {
    if (port && baudRate) {
      onConnect(port, baudRate)
    } else {
      alert('Por favor selecciona un puerto y un baud rate')
    }
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
        />
      </label>

      <label>
        Baud Rate:
        <select value={baudRate} onChange={(e) => setBaudRate(e.target.value)}>
          {baudRates.map((rate) => (
            <option key={rate} value={rate}>
              {rate}
            </option>
          ))}
        </select>
      </label>

      <button onClick={handleConnect}>Conectar</button>
    </div>
  )
}

export default PortConfig
