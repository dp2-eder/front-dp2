// Configuración centralizada del API
// ⚠️ IMPORTANTE: Todas las URLs deben estar en variables de entorno (.env.local)
// No usar URLs hardcodeadas en el código

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://1inf47-1083.inf.pucp.edu.pe';
export const MENU_URL = process.env.NEXT_PUBLIC_MENU_URL || 'https://1inf47-1083.inf.pucp.edu.pe';
export const PIZZAS_URL = process.env.NEXT_PUBLIC_PIZZAS_URL || 'https://1inf47-1083.inf.pucp.edu.pe';
export const SELENIUM_URL = process.env.NEXT_PUBLIC_SELENIUM_URL || 'https://1inf47-1083.inf.pucp.edu.pe';

// Validar que al menos la API base URL esté configurada
if (!API_BASE_URL && typeof window === 'undefined') {
  console.warn('⚠️ NEXT_PUBLIC_API_URL no está configurada en las variables de entorno');
}
