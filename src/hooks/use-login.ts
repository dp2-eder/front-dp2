/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { API_BASE_URL } from "@/lib/api-config";

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
