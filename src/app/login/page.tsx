"use client";

import { User, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser, type LoginResponse } from "@/hooks/use-login";
import { API_BASE_URL } from "@/lib/api-config";
import { clearLocalStoragePreservingImageCache } from "@/lib/image-cache";
import { useAforo } from "@/context/aforo-context";

import { toast } from "sonner"


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchAforo } = useAforo();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mesaNumero, setMesaNumero] = useState<string | null>(null);


  // Soporta ?mesa=ID o un parámetro "key-only" tipo ?01K8...
  const mesaId =
    searchParams.get("mesa") ?? Array.from(searchParams.keys())[0] ?? "";



  // Fetch del número de mesa cuando el componente se monta
  useEffect(() => {
    if (mesaId) {
      const fetchMesaData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/mesas/${mesaId}`);

          if (!response.ok) {
            // Manejo de errores HTTP como 404, 400, 500, etc.
            toast.error("La mesa no existe o no se encontró.");
            return;
          }

          const data = await response.json() as { numero: string };
          setMesaNumero(data.numero);

        } catch (error) {
          // Errores de red (sin conexión, CORS, timeout, etc.)
          console.log(error);
          toast.error("Error con la conexión al sistema.");
        }
      };

      void fetchMesaData();
    }
  }, [mesaId]);

  const validateNombre = (value: string): boolean => {
    if (!value.trim()) {
      setNombreError("El nombre es requerido");
      return false;
    }
    setNombreError("");
    return true;
  };

  const validateEmail = (value: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      setEmailError("El correo electrónico es requerido");
      return false;
    }
    if (!regex.test(value)) {
      setEmailError("Ingrese un correo en formato válido. Ejm: hola@ejemplo.com");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombre(value);
    if (nombreError && value.trim()) setNombreError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) validateEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNombreValid = validateNombre(nombre);
    const isEmailValid = validateEmail(email);

    // Obtener aforo total del contexto
    void fetchAforo()


    if (isNombreValid && isEmailValid) {
      setIsLoading(true);

      try {
        // ✅ NUEVO FLUJO SIMPLIFICADO
        // El endpoint /api/v1/login maneja automáticamente:
        // - Creación de usuario si no existe
        // - Actualización del nombre si cambió
        // - Manejo de sesiones de mesa compartidas
        console.log("🔐 Intentando login con email:", email, "nombre:", nombre);

        const loginResponse = await loginUser(
          { email, nombre },
          mesaId // Pasar el ID de la mesa
        );

        // Verificar si hubo error
        if (loginResponse && 'error' in loginResponse && loginResponse.error) {
          toast.error("Fallo en el login");
          console.log(`Login falló: ${loginResponse.error}`);
        }

        // Castear a LoginResponse (sabemos que es válida si no tiene error)
        const response = loginResponse as LoginResponse;
        console.log("✅ Login exitoso");

        // Verificar que tenemos el token_sesion
        if (!response.token_sesion) {
          toast.error("Error de servidor");
          console.log ("El servidor no devolvió token_sesion")
        }

        // Limpiar localStorage antes de guardar datos del usuario
        // Pero preservar el caché de imágenes para mejor rendimiento
        clearLocalStoragePreservingImageCache();

        // Guardar datos del nuevo login
        localStorage.setItem("id_usuario", response.id_usuario);
        localStorage.setItem("id_sesion_mesa", response.id_sesion_mesa);
        localStorage.setItem("token_sesion", response.token_sesion);
        localStorage.setItem("fecha_expiracion", response.fecha_expiracion);

        // Guardar datos locales
        localStorage.setItem("userName", nombre);
        localStorage.setItem("userEmail", email);
        if (mesaId) localStorage.setItem("mesaId", mesaId);

        // Log de confirmación
        console.log("🔑 Datos de sesión guardados:", {
          id_usuario: response.id_usuario,
          id_sesion_mesa: response.id_sesion_mesa,
          token_sesion: `${response.token_sesion.substring(0, 20)}...`,
          fecha_expiracion: response.fecha_expiracion,
        });

        router.push("/about"); // navega solo si no hubo error
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido";
        //console.error("❌ Error en login:", errorMsg);
        console.log(`Error: ${errorMsg}`)
        toast.error(`Error desconocido`);
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

        {/* Eslogan */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-white text-xl md:text-2xl font-light italic mb-2">
            &ldquo;Sabores Auténticos&rdquo;
          </h1>
          <h2 className="text-white text-xl md:text-2xl font-light italic mb-4">
            &ldquo;Momentos Inolvidables&rdquo;
          </h2>

          {/* Número de Mesa */}
          {mesaNumero && (
            <p className="text-white text-lg md:text-2xl font-bold italic">
              Mesa Nro. {mesaNumero}
            </p>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={(e) => { void handleSubmit(e) }} noValidate className="w-full max-w-md space-y-4 md:space-y-6">
          {/* Input Nombre */}
          <div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={handleNombreChange}
                className={`w-full h-12 md:h-14 pl-4 pr-12 text-base md:text-lg rounded-xl border-2 ${nombreError
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#004166] focus:border-[#004166]'
                  } bg-white shadow-lg`}
              />
              <User className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${nombreError ? 'text-red-500' : 'text-gray-400'
                }`} />
            </div>
            {nombreError && (
              <p className="text-red-600 text-sm mt-2 ml-2 font-medium">
                {nombreError}
              </p>
            )}
          </div>

          {/* Input Email */}
          <div>
            <div className="relative">
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => email && validateEmail(email)}
                className={`w-full h-12 md:h-14 pl-4 pr-12 text-base md:text-lg rounded-xl border-2 ${emailError
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-[#004166] focus:border-[#004166]'
                  } bg-white shadow-lg`}
              />
              <Mail className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${emailError ? 'text-red-500' : 'text-gray-400'
                }`} />
            </div>
            {emailError && (
              <p className="text-red-600 text-sm mt-2 ml-2 font-medium">
                {emailError}
              </p>
            )}
          </div>

          {/* Botón Ingresar - ancho ajustado al contenido */}
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