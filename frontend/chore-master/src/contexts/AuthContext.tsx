import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isTokenValid: () => boolean;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const COOKIE_NAME = 'chore_master_auth';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const isTokenValid = (): boolean => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(newToken);

      setLoginError(null);   
      setToken(newToken);
      setUser(decoded);
      setIsAuthenticated(true);
      
      const expirationDate = new Date(decoded.exp * 1000);
      document.cookie = `${COOKIE_NAME}=${newToken}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
    } catch (error) {
      console.error('Invalid token:', error);
      setLoginError('Invalid authentication token');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoginError(null);
    
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  useEffect(() => {
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1];

    if (cookieToken && isTokenValidForToken(cookieToken)) {
      login(cookieToken);
    }
  }, []);

  const isTokenValidForToken = (tokenToCheck: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(tokenToCheck);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    isTokenValid,
    loginError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};