"use client"

import { Facebook, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function Footer() {
  return (
    <footer className="bg-[url('/Footer.jpg')] bg-cover bg-center bg-no-repeat text-white relative">
      <div className="absolute inset-0" />

      {/* 🌟 Logo centrado sobresaliendo del borde superior (solo desktop) */}
      <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center z-20">
        {/* Línea izquierda */}
        <div className="h-px bg-white/30 w-36 md:w-48 lg:w-64" />

        {/* Logo */}
        <div className="mx-3 bg-white rounded-[25px] p-1.5 overflow-hidden" style={{
          boxShadow: '0 15px 35px rgba(0,0,0,0.25), 0 5px 15px rgba(0,0,0,0.15)'
        }}>
          <Link href="/about" data-cy="logo">
            <Image
              src="/dineline2.svg"
              alt="DINE LINE"
              width={90}
              height={90}
              className="h-16 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Línea derecha */}
        <div className="h-px bg-white/30 w-36 md:w-48 lg:w-64" />
      </div>

      <div className="max-w-[1110px] mx-auto px-4 py-12 relative z-10">
        {/* Tagline */}
        <div className="text-center mb-6">
          <p className="text-sm text-white/80">
            Sabores Auténticos, Momentos Inolvidables.
          </p>
        </div>

        {/* Social Media */}
        <div className="flex justify-center space-x-6 mb-3">
          <a
            href="https://facebook.com"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>

        {/* Social Media Text */}
        <div className="text-center">
          <p className="text-xs text-white/60">
            Síguenos En Nuestras Redes Sociales
          </p>
        </div>
      </div>
    </footer>
  );
}