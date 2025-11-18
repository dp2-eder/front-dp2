"use client";

import { User, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearLocalStoragePreservingImageCache } from "@/lib/image-cache";

export default function AdminLoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [usuarioError, setUsuarioError] = useState("");
  const [contraseñaError, setContraseñaError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Deshabilitar navegación hacia atrás
  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.pathname);
    };

    // Agregar un estado inicial a la historia para poder bloquear el back
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const validateUsuario = (value: string): boolean => {
    if (!value.trim()) {
      setUsuarioError("El usuario es requerido");
      return false;
    }
    setUsuarioError("");
    return true;
  };

  const validateContraseña = (value: string): boolean => {
    if (!value.trim()) {
      setContraseñaError("La contraseña es requerida");
      return false;
    }
    if (value.length < 6) {
      setContraseñaError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    setContraseñaError("");
    return true;
  };

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsuario(value);
    if (usuarioError && value.trim()) setUsuarioError("");
  };

  const handleContraseñaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContraseña(value);
    if (contraseñaError && value.trim()) setContraseñaError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUsuarioValid = validateUsuario(usuario);
    const isContraseñaValid = validateContraseña(contraseña);

    if (isUsuarioValid && isContraseñaValid) {
      setIsLoading(true);

      try {
        // MODO DEMO: Solo validación local, sin conexión al backend
        console.log("🔐 Login de admin (DEMO MODE):", usuario);

        // Simular pequeño delay de "validación"
        await new Promise(resolve => setTimeout(resolve, 500));

        // Limpiar localStorage antes de guardar datos del usuario
        clearLocalStoragePreservingImageCache();

        // Guardar datos de sesión (demo)
        const demoToken = `demo_token_${Date.now()}`;
        localStorage.setItem("id_usuario", `admin_${  usuario}`);
        localStorage.setItem("token_sesion", demoToken);
        localStorage.setItem("fecha_expiracion", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("userRole", "admin");

        console.log("✅ Login de admin exitoso (DEMO)");
        console.log("🔑 Datos de sesión guardados en localStorage");

        router.push("/admin/menu"); // navega al menu del admin
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido";
        console.error("❌ Error en login de admin:", errorMsg);
        alert(`Error: ${errorMsg}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#5B9BB8]">
      {/* Fondo con patrón de pescados - rotados 45 grados hacia arriba */}
      <div
        className="absolute opacity-30"
        style={{
          backgroundImage: "url('/pescado-inicio.jpg')",
          backgroundSize: '150px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          transform: 'rotate(-45deg)',
          transformOrigin: 'center',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%'
        }}
      />

      {/* Overlay azulado */}
      <div className="absolute inset-0 bg-[#5B9BB8]/60" />

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Logo */}
        <div className="mb-8 bg-white rounded-3xl p-6 shadow-2xl">
          <Image
            src="/logo_login.png"
            alt="DINE LINE"
            width={120}
            height={120}
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>

        {/* Título */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
            Panel de Administrador
          </h1>
          <p className="text-white text-base md:text-lg font-light">
            Acceso restringido
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={(e) => { void handleSubmit(e) }} noValidate className="w-full max-w-md space-y-4 md:space-y-6">
          {/* Input Usuario */}
          <div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={handleUsuarioChange}
                className={`w-full h-12 md:h-14 pl-4 pr-12 text-base md:text-lg rounded-xl border-2 ${usuarioError
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#004166] focus:border-[#004166]'
                  } bg-white shadow-lg`}
              />
              <User className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${usuarioError ? 'text-red-500' : 'text-gray-400'
                }`} />
            </div>
            {usuarioError && (
              <p className="text-red-600 text-sm mt-2 ml-2 font-medium">
                {usuarioError}
              </p>
            )}
          </div>

          {/* Input Contraseña */}
          <div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={handleContraseñaChange}
                onBlur={() => contraseña && validateContraseña(contraseña)}
                className={`w-full h-12 md:h-14 pl-4 pr-12 text-base md:text-lg rounded-xl border-2 ${contraseñaError
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#004166] focus:border-[#004166]'
                  } bg-white shadow-lg`}
              />
              <Lock className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${contraseñaError ? 'text-red-500' : 'text-gray-400'
                }`} />
            </div>
            {contraseñaError && (
              <p className="text-red-600 text-sm mt-2 ml-2 font-medium">
                {contraseñaError}
              </p>
            )}
          </div>

          {/* Botón Ingresar */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 md:h-14 px-12 bg-[#004166] hover:bg-[#003d5c] text-white text-lg md:text-xl font-bold rounded-xl shadow-2xl transition-all duration-200 hover:scale-105 mt-6 md:mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
