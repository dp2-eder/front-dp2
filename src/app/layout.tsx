import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { AforoProvider } from '@/context/aforo-context'
import { OrderHistoryProvider } from '@/context/order-history-context'
import { AforoProvider } from '@/context/aforo-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de Restaurante DP2',
  description: 'Sistema integral de gestión para restaurantes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Preload de imágenes críticas para mejor LCP */}
        {/*
        <link rel="preload" as="image" href="/fresh-ceviche-with-red-onions-and-sweet-potato.jpg" />
        <link rel="preload" as="image" href="/mixed-seafood-ceviche-with-shrimp-and-octopus.jpg" />
        <link rel="preload" as="image" href="/tiradito-nikkei-with-thin-fish-slices-and-sesame.jpg" />
        <link rel="preload" as="image" href="/fondo-mobile-inicio.jpg" />
        */}
      </head>
      <body className={inter.className}>
        <AforoProvider>
          <OrderHistoryProvider>
            {children}
          </OrderHistoryProvider>
        </AforoProvider>
      </body>
    </html>
  )
}
