import Link from "next/link"

import LoginForm from '@/components/forms/login-form'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Sistema de Restaurante DP2
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-primary-600">
              Gestión de Órdenes
            </h2>
            <p className="text-gray-600">
              Administra órdenes en tiempo real con seguimiento completo.
            </p>
          </div>

          <Link href="/menu" className="block">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-4 text-primary-600">
                Menú Digital
              </h2>
              <p className="text-gray-600">
                Gestiona tu menú con categorías, items y modificadores.
              </p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-primary-600">
              Punto de Venta
            </h2>
            <p className="text-gray-600">
              Sistema POS completo con múltiples métodos de pago.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-primary-600">
              Cocina
            </h2>
            <p className="text-gray-600">
              Display de cocina para optimizar la preparación de órdenes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-primary-600">
              Inventario
            </h2>
            <p className="text-gray-600">
              Control de stock, proveedores y alertas automáticas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-primary-600">
              Analíticas
            </h2>
            <p className="text-gray-600">
              Reportes detallados y insights de tu negocio.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Acceder al Sistema
          </button>
        </div>
      </div>
    </main>
  )
}
