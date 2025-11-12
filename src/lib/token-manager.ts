// Gestión centralizada de tokens de autenticación

export const TokenManager = {
  // Guardar tokens
  setTokens: (accessToken: string, refreshToken?: string, tokenType?: string) => {
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    if (tokenType) localStorage.setItem("token_type", tokenType);
  },

  // Obtener access token
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  // Obtener refresh token
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
  },

  // Obtener token type
  getTokenType: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token_type");
  },

  // Obtener header de autenticación
  getAuthHeader: (): { Authorization: string } | null => {
    const accessToken = TokenManager.getAccessToken();
    const tokenType = TokenManager.getTokenType() || "bearer";

    if (!accessToken) return null;

    return {
      Authorization: `${tokenType} ${accessToken}`
    };
  },

  // Limpiar tokens
  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
  },

  // Verificar si hay token válido
  hasValidToken: (): boolean => {
    return TokenManager.getAccessToken() !== null;
  }
};
