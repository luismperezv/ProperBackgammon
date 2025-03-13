import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

interface JwtPayload {
  exp?: number;
  sub?: string;
  [key: string]: any;
}

const tokenService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string, expiresIn?: number): void {
    localStorage.setItem(TOKEN_KEY, token);
    
    if (expiresIn) {
      const expiryTime = new Date().getTime() + expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    } else {
      // If expiresIn is not provided, try to get expiry from token
      const expiry = this.getTokenExpirationTime(token);
      if (expiry) {
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
      }
    }
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    // First check stored expiry time
    const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      if (new Date().getTime() > expiryTime) {
        this.removeToken();
        return true;
      }
    }

    // Fallback to JWT expiration claim
    const expirationTime = this.getTokenExpirationTime(token);
    if (!expirationTime) return true;

    const isExpired = new Date().getTime() > expirationTime;
    if (isExpired) {
      this.removeToken();
    }
    return isExpired;
  },

  getTokenExpirationTime(token: string): number | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return null;
      return decoded.exp * 1000; // Convert to milliseconds
    } catch {
      return null;
    }
  },

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.sub || null;
    } catch {
      return null;
    }
  },
};

export default tokenService; 