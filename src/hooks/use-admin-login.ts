/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { API_BASE_URL } from "@/lib/api-config";

export interface AdminLoginRequest {
  usuario: string;
  contraseña: string;
}

export interface AdminLoginResponse {
  success?: boolean;
  error?: string;
  id_usuario?: string;
  token_sesion?: string;
  fecha_expiracion?: string;
  usuario?: string;
}

/**
 * Login del Admin usando usuario y contraseña
 *
 * @param data - AdminLoginRequest con usuario y contraseña
 * @returns AdminLoginResponse con token_sesion y otros datos
 */
export async function loginAdmin(
  data: AdminLoginRequest
): Promise<AdminLoginResponse> {
  try {
    // Construir URL para el login del admin
    const url = new URL("/api/admin/login", window.location.origin);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: data.usuario,
        contraseña: data.contraseña,
      }),
    });

    const text = await response.text();
    let result: AdminLoginResponse = {};
    try {
      result = text ? JSON.parse(text) as AdminLoginResponse : {};
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

    // Guardar token_sesion en localStorage si existe
    if ((result as AdminLoginResponse)?.token_sesion) {
      localStorage.setItem("token_sesion", (result as AdminLoginResponse).token_sesion);
      localStorage.setItem("id_usuario", (result as AdminLoginResponse).id_usuario || "");
      localStorage.setItem("fecha_expiracion", (result as AdminLoginResponse).fecha_expiracion || "");
      localStorage.setItem("usuario", (result as AdminLoginResponse).usuario || "");
      localStorage.setItem("userRole", "admin");
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}
