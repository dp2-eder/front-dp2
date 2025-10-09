"use client"

import { Fish, Droplets, Home, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo container */}
        <div className="relative mb-8">
          {/* Logo background */}
          <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
            <Image src="/DINE LINE.svg" alt="DINE LINE" width={48} height={48} className="h-12 w-auto" />
          </div>
          
          {/* Floating marine elements */}
          <Fish className="absolute -top-3 -right-3 w-8 h-8 text-white animate-bounce" />
          <Droplets className="absolute -bottom-3 -left-3 w-6 h-6 text-white/80 animate-pulse" />
        </div>

        {/* 404 Error */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">404</span>
          </div>
        </div>
        
        <h2 className="text-white text-2xl font-semibold mb-2">Página no encontrada</h2>
        <p className="text-white/80 text-sm mb-8">La página que buscas no existe en DINE LINE</p>
        
        {/* Botones con el mismo tamaño */}
        <div className="flex flex-col gap-4 justify-center max-w-xs mx-auto">
          <Link href="/" className="w-full">
            <button className="w-full flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              <Home className="w-5 h-5" />
              <span>Ir al Inicio</span>
            </button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver Atrás</span>
          </button>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-8">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  )
}
