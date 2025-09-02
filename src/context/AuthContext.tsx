import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  sendSmsOtp: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (otp: string, identifier: string, type: 'email' | 'sms') => Promise<{ success: boolean; user?: User; token?: string; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session on app load
    const token = localStorage.getItem('beg_auth_token');
    const userData = localStorage.getItem('beg_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('beg_auth_token');
        localStorage.removeItem('beg_user');
      }
    }
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem('beg_auth_token', token);
    localStorage.setItem('beg_user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('beg_auth_token');
    localStorage.removeItem('beg_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Mock OTP functions - will be replaced with Supabase later
  const sendEmailOtp = async (email: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: `OTP sent to ${email}` 
        });
      }, 1000);
    });
  };

  const sendSmsOtp = async (phone: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: `OTP sent to ${phone}` 
        });
      }, 1000);
    });
  };

  const verifyOtp = async (otp: string, identifier: string, type: 'email' | 'sms'): Promise<{ success: boolean; user?: User; token?: string; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp === '123456') {
          const mockUser: User = {
            id: '1',
            [type === 'email' ? 'email' : 'phone']: identifier,
            name: 'Test User'
          };
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          resolve({
            success: true,
            user: mockUser,
            token: mockToken,
            message: 'Successfully verified!'
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid OTP. Try 123456 for demo.'
          });
        }
      }, 1000);
    });
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    sendEmailOtp,
    sendSmsOtp,
    verifyOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};