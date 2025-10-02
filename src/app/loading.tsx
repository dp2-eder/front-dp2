import { Fish, Droplets } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo container */}
        <div className="relative mb-8">
          {/* Logo background */}
          <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
            <img src="/DINE LINE.svg" alt="DINE LINE" className="h-12 w-auto" />
          </div>
          
          {/* Floating marine elements */}
          <Fish className="absolute -top-3 -right-3 w-8 h-8 text-white animate-bounce" />
          <Droplets className="absolute -bottom-3 -left-3 w-6 h-6 text-white/80 animate-pulse" />
        </div>

        {/* Loading animation */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <Fish className="absolute inset-0 m-auto w-6 h-6 text-white animate-pulse" />
        </div>
        
        <h2 className="text-white text-xl font-semibold">Cargando DINE LINE</h2>
        <p className="text-white/80 text-sm mt-2">Sabores auténticos del mar peruano</p>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  )
}