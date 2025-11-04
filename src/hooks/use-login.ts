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
    const response = await fetch("api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    let result: any;
    try {
      result = text ? JSON.parse(text) : null;
    } catch {
      result = text;
    }

    if (!response.ok) {
      throw new Error(result?.error || result?.detail || `Error ${response.status}`);
    }

    return result;
  } catch (error: any) {
    console.error("❌ Error al registrar usuario:", error);
    return { success: false, error: error.message };
  }
}
