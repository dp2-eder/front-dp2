"use client";

import { User, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser, registerUser, type RegisterResponse } from "@/hooks/use-login";


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  // Soporta ?mesa=ID o un parámetro “key-only” tipo ?01K8...
  const mesaId =
    searchParams.get("mesa") ?? Array.from(searchParams.keys())[0] ?? "";

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

    if (isNombreValid && isEmailValid) {
      setIsLoading(true);

      try {
        const password = "password123"; // TODO: reemplazar por real

        // 1️⃣ Intenta hacer LOGIN primero
        //console.log("🔐 Intentando login con email:", email);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const loginResponseUnknown: unknown = await loginUser({ email, password });
        const loginResponse = loginResponseUnknown as RegisterResponse;

        if (loginResponse.error && typeof loginResponse.error === 'string') {
          // 2️⃣ Si falla el login, intenta REGISTRAR
          //console.log("❌ Login falló, intentando registro automático...");
          const registerPayload = {
            email,
            password,
            nombre,
            telefono: "000000000",              // TODO: reemplazar por real
            id_rol: "01K98T4KTD9H23FGQP24XT7P53", // TODO: reemplazar por real
          };

          const registerResponseUnknown: unknown = await registerUser(registerPayload);
          const registerResponse = registerResponseUnknown as RegisterResponse;

          if (registerResponse.error && typeof registerResponse.error === 'string') {
            throw new Error(`Registro falló: ${registerResponse.error}`);
          }

          // Guardar el id_usuario del registro desde usuario.id
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const registerUsuario = registerResponse.usuario;
          if (!registerUsuario || typeof registerUsuario !== 'object' || !('id' in registerUsuario)) {
            throw new Error("El servidor no devolvió ID de usuario");
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const userId = String(registerUsuario.id);
          if (!userId) {
            throw new Error("El servidor no devolvió ID de usuario");
          }

          //console.log("✅ Usuario registrado exitosamente con ID:", userId);

          // Limpiar localStorage antes de guardar datos del nuevo usuario
          localStorage.clear();
          localStorage.setItem("userId", userId);
        } else {
          // 3️⃣ Si login fue exitoso, guardar id_usuario desde usuario.id
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const loginUsuario = loginResponse.usuario;
          if (!loginUsuario || typeof loginUsuario !== 'object' || !('id' in loginUsuario)) {
            throw new Error("El servidor no devolvió ID de usuario");
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const userId = String(loginUsuario.id);
          if (!userId) {
            throw new Error("El servidor no devolvió ID de usuario");
          }

          //console.log("✅ Login exitoso con ID:", userId);
          localStorage.setItem("userId", userId);
        }

        // Guardar datos locales
        localStorage.setItem("userName", nombre);
        localStorage.setItem("userEmail", email);
        if (mesaId) localStorage.setItem("mesaId", mesaId);

        router.push("/about"); // navega solo si no hubo error
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido";
        //console.error("❌ Error en login/registro:", errorMsg);
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

        {/* Eslogan */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-white text-xl md:text-2xl font-light italic mb-2">
            &ldquo;Sabores Auténticos&rdquo;
          </h1>
          <h2 className="text-white text-xl md:text-2xl font-light italic mb-4">
            &ldquo;Momentos Inolvidables&rdquo;
          </h2>

          {/* Número de Mesa */}
          {/*mesaId && (
            <p className="text-white text-lg md:text-2xl font-bold italic">
              Mesa ID: {mesaId}
            </p>
          )*/}
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