/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
  id_rol: string;
}

export interface Usuario {
  email: string;
  nombre: string;
  telefono: string;
  id_rol: string;
  id: string;
  activo: boolean;
  ultimo_acceso: string;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface RegisterResponse {
  status?: number;
  code?: string;
  message?: string;
  success?: boolean;
  error?: string;
  usuario?: Usuario;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  // campos para manejo de errores
  id?: string;
  id_usuario?: string;
}

export async function loginUser(data: LoginRequest): Promise<RegisterResponse> {
  try {
    const response = await fetch("/api/auth/login", {
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
      const errorMessage = (result as Record<string, string>)?.error || (result as Record<string, string>)?.detail || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}

export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await fetch("/api/auth/register", {
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
      const errorMessage = (result as Record<string, string>)?.error || (result as Record<string, string>)?.detail || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}
