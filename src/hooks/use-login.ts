/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { setCookie } from "cookies-next";

import { API_BASE_URL } from "@/lib/api-config";
import {
  LoginRequest,
  RegisterRequest,
  Usuario,
  LoginResponse,
  RegisterResponse
} from "@/types/auth";

// Re-export para compatibilidad hacia atrás
export type { LoginRequest, RegisterRequest, Usuario, LoginResponse, RegisterResponse }

/**
 * Nuevo login simplificado usando el endpoint /api/v1/login
 * Maneja automáticamente:
 * - Creación de usuario si no existe
 * - Actualización del nombre si cambió
 * - Manejo de sesiones de mesa compartidas (mismo token para múltiples usuarios)
 *
 * @param data - LoginRequest con email y nombre
 * @param idMesa - ID de la mesa (si no se proporciona, intenta obtener del localStorage)
 * @returns LoginResponse con token_sesion y otros datos
 */
export async function loginUser(
  data: LoginRequest,
  idMesa?: string
): Promise<LoginResponse | RegisterResponse> {
  try {
    // Obtener id_mesa del parámetro o de localStorage
    const mesas = idMesa || localStorage.getItem("mesaId");
    if (!mesas) {
      throw new Error("ID de mesa no encontrado. Por favor, selecciona una mesa primero.");
    }

    // Construir URL directa al backend (sin proxy)
    const url = new URL(`${API_BASE_URL}/api/v1/login`);
    url.searchParams.append("id_mesa", mesas);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        nombre: data.nombre,
      }),
    });

    const text = await response.text();
    let result: LoginResponse | RegisterResponse = {};
    try {
      result = text ? JSON.parse(text) as LoginResponse : {};
    } catch {
      result = { error: text };
    }

    if (!response.ok) {
      const errorMessage =
        (result as Record<string, string>)?.error ||
        (result as Record<string, string>)?.message ||
        (result as Record<string, string>)?.detail ||
        `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    // Guardar token_sesion en cookies si existe
    if ((result as LoginResponse)?.token_sesion) {
      const oneWeekInDays = 7;
      void setCookie("token_sesion", (result as LoginResponse).token_sesion, { maxAge: 60 * 60 * 24 * oneWeekInDays });
      void setCookie("id_usuario", (result as LoginResponse).id_usuario, { maxAge: 60 * 60 * 24 * oneWeekInDays });
      void setCookie("id_sesion_mesa", (result as LoginResponse).id_sesion_mesa, { maxAge: 60 * 60 * 24 * oneWeekInDays });
      void setCookie("fecha_expiracion", (result as LoginResponse).fecha_expiracion, { maxAge: 60 * 60 * 24 * oneWeekInDays });

      // Mantener mesaId en localStorage para redireccionamientos
      if (idMesa) {
        localStorage.setItem("mesaId", idMesa);
      }
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}

/**
 * DEPRECATED: Función de registro antigua
 * Ya no es necesaria - loginUser maneja la creación/actualización de usuarios
 * Se mantiene solo para compatibilidad hacia atrás
 */
export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  console.warn(
    "registerUser() está deprecado. Usa loginUser() en su lugar, que maneja creación y actualización de usuarios."
  );
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    let result: RegisterResponse = {};
    try {
      result = text ? JSON.parse(text) as RegisterResponse : {};
    } catch {
      result = { error: text };
    }

    if (!response.ok) {
      const errorMessage =
        (result as Record<string, string>)?.error ||
        (result as Record<string, string>)?.detail ||
        `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}

interface RolResponse {
  id: string;
  nombre: string;
  activo: boolean;
}

interface RolesApiResponse {
  items: RolResponse[];
  total: number;
}

export async function getClientRoleId(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/roles?skip=0&limit=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo roles: ${response.status}`);
    }

    const result = await response.json() as RolesApiResponse;
    const clientRole = result.items.find((rol: RolResponse) => rol.nombre === "Cliente");

    if (!clientRole) {
      throw new Error("No se encontró el rol 'Cliente'");
    }

    return clientRole.id;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al obtener rol";
    throw new Error(errorMessage);
  }
}
