'use client'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function QRLogin() {
  const [isScanning, setIsScanning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleQRScan = () => {
    setIsScanning(true)
    
    // Simular escaneo
    setTimeout(() => {
      setIsScanning(false)
      setShowSuccess(true)
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setShowSuccess(false), 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Sistema Restaurante DP2
          </CardTitle>
          <CardDescription>
            Escanea el código QR para acceder al sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Alert de éxito */}
          {showSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                ✅ QR escaneado exitosamente. Redirigiendo...
              </AlertDescription>
            </Alert>
          )}
          
          {/* Área de escaneo */}
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center">
              {isScanning ? (
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Escaneando QR...</p>
                  <Badge variant="secondary">Procesando</Badge>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <svg className="w-16 h-16 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <div className="space-y-2">
                    <p className="font-medium">Código QR</p>
                    <p className="text-sm text-muted-foreground">Posiciona el código en el área de escaneo</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de acción */}
          <Button 
            onClick={handleQRScan}
            disabled={isScanning}
            className="w-full"
            size="lg"
          >
            {isScanning ? 'Escaneando...' : 'Iniciar Escaneo QR'}
          </Button>

          {/* Badges informativos */}
          <div className="flex justify-center space-x-2">
            <Badge variant="secondary">DOMOTICA</Badge>
            <Badge variant="outline">Integración</Badge>
            <Badge variant="default">DP2</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
