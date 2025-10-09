'use client'
import { useState } from 'react'

export default function QRLogin() {
  const [isScanning, setIsScanning] = useState(false)

  const handleQRScan = () => {
    setIsScanning(true)
    // Integración con backend DOMOTICA más adelante
    setTimeout(() => {
      setIsScanning(false)
      //console.log('QR escaneado exitosamente')
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Sistema Restaurante DP2
          </h1>
          
          <div className="mb-8">
            <div className="w-64 h-64 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {isScanning ? (
                <div className="text-blue-600 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4">Escaneando QR...</p>
                </div>
              ) : (
                <div className="text-gray-500 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-lg font-medium">Escanea el código QR</p>
                  <p className="text-sm mt-2">para acceder al sistema</p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleQRScan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            disabled={isScanning}
          >
            {isScanning ? 'Escaneando...' : 'Iniciar Escaneo QR'}
          </button>

          <div className="mt-6 text-sm text-gray-500">
            <p>Sistema de Gestión de Restaurante</p>
            <p>Integración con DOMOTICA</p>
          </div>
        </div>
      </div>
    </div>
  )
}
