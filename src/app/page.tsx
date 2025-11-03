

import { Fish, Droplets } from "lucide-react";
import Image from "next/image";
import { redirect } from 'next/navigation';

export default function Home() {
  if (typeof window !== 'undefined') {
    const search = window.location.search;
    // search: ?IDMESA
    const mesaId = search.startsWith('?') && search.length > 1 ? search.substring(1) : null;
    if (mesaId) {
      redirect(`/login?${mesaId}`);
      return null;
    }
  }
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
        {/* Error icon */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">!</span>
          </div>
        </div>
        <h2 className="text-white text-2xl font-semibold mb-2">Falta el ID de la mesa</h2>
        <p className="text-white/80 text-sm mb-8">Por favor, añade <b>/login?TU_ID_MESA</b> al link para continuar.</p>
      </div>
    </div>
  );
}