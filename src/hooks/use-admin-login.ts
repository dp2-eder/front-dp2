/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { setCookie } from "cookies-next";

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

    // Guardar token_sesion en cookies si existe
    if ((result)?.token_sesion) {
      const oneWeekInDays = 7;
      void setCookie("token_sesion", (result).token_sesion, { maxAge: 60 * 60 * 24 * oneWeekInDays });
      void setCookie("id_usuario", (result).id_usuario || "", { maxAge: 60 * 60 * 24 * oneWeekInDays });
      void setCookie("fecha_expiracion", (result).fecha_expiracion || "", { maxAge: 60 * 60 * 24 * oneWeekInDays });
      void setCookie("usuario", (result).usuario || "", { maxAge: 60 * 60 * 24 * oneWeekInDays });
      void setCookie("userRole", "admin", { maxAge: 60 * 60 * 24 * oneWeekInDays });
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}
