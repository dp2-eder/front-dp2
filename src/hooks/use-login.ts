/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
  id_rol: string;
}

export interface RegisterResponse {
  message?: string;
  success?: boolean;
  error?: string;
  // agrega más campos si tu backend devuelve algo adicional
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
