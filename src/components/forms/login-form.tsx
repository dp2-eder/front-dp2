"use client"

import { Fish, Eye, EyeOff, Lightbulb, Mail, Lock, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validar credenciales admin@dp2.com/admin
    if (email === "admin@dp2.com" && password === "admin") {
      setTimeout(() => {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("user", JSON.stringify({ 
          email: "admin@dp2.com", 
          role: "admin",
          name: "Administrador DP2"
        }))
        router.push("/home")
        setIsLoading(false)
      }, 1000)
    } else {
      setTimeout(() => {
        setError("Credenciales incorrectas. Use admin@dp2.com / admin")
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Fish className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">DP2</h1>
              <p className="text-sm text-gray-600">Cevichería</p>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Bienvenido de vuelta
          </CardTitle>
          <CardDescription className="text-gray-600">
            Ingresa tus credenciales para acceder al sistema de gestión
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Correo electrónico</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@dp2.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Contraseña</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700 flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Credenciales de prueba:</strong><br/>
                  Email: <code className="bg-white px-1 rounded">admin@dp2.com</code><br/>
                  Contraseña: <code className="bg-white px-1 rounded">admin</code>
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-gray-600">Recordarme</span>
              </label>
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => {/* TODO: Implementar recuperación de contraseña */}}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-11 border-gray-200 hover:bg-gray-50"
            >
              <span className="mr-2">G</span>
              Google
            </Button>
            <Button 
              variant="outline" 
              className="h-11 border-gray-200 hover:bg-gray-50"
            >
              <span className="mr-2">T</span>
              Twitter
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            Sistema de gestión para Cevichería DP2
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
