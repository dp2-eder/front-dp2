/**
 * Tipos centralizados para autenticación y usuario
 */

/**
 * Request para nuevo login simplificado
 * POST /api/v1/login?id_mesa=...
 */
export interface LoginRequest {
  email: string
  nombre: string
}

/**
 * Request para registro de usuario (DEPRECATED)
 * Ahora el login maneja la creación/actualización de usuarios
 */
export interface RegisterRequest {
  email: string
  password: string
  nombre: string
  telefono: string
  id_rol: string
}

/**
 * Estructura de un usuario
 */
export interface Usuario {
  email: string
  nombre: string
  telefono: string
  id_rol: string
  id: string
  activo: boolean
  ultimo_acceso: string
  fecha_creacion: string
  fecha_modificacion: string
}

/**
 * Response del nuevo login endpoint
 * POST /api/v1/login
 * Maneja creación/actualización de usuario y sesión de mesa
 */
export interface LoginResponse {
  status: number
  code: string
  message: string
  id_usuario: string
  id_sesion_mesa: string
  token_sesion: string
  fecha_expiracion: string
  error?: string
}

/**
 * Response de login/registro legacy (DEPRECATED)
 * Mantener solo para compatibilidad hacia atrás
 */
export interface RegisterResponse {
  status?: number
  code?: string
  message?: string
  success?: boolean
  error?: string
  usuario?: Usuario
  access_token?: string
  refresh_token?: string
  token_type?: string
  id?: string
  id_usuario?: string
  id_sesion_mesa?: string
  token_sesion?: string
  fecha_expiracion?: string
}

/**
 * Response de API de roles
 */
export interface RolResponse {
  id: string
  nombre: string
  descripcion?: string
}

/**
 * Response wrapper de API para roles
 */
export interface RolesApiResponse {
  roles: RolResponse[]
}
