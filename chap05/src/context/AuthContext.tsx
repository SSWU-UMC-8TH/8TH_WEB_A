// src/context/AuthContext.tsx
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { postSignin, postLogout } from '../apis/authApi';
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from '../utils/localStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { RequestSigninDto } from '../types/authTypes';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  accessToken: string | null;
  login: (data: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, _setAccessToken] = useState<string | null>(
    getLocalStorage(LOCAL_STORAGE_KEY.accessToken)
  );
  const navigate = useNavigate();

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { access_token, refresh_token } = await postSignin(signinData);
      // 1) utils 로 raw 문자열 저장
      setLocalStorage(LOCAL_STORAGE_KEY.accessToken, access_token);
      setLocalStorage(LOCAL_STORAGE_KEY.refreshToken, refresh_token);
      // 2) state 업데이트
      _setAccessToken(access_token);
      navigate('/my', { replace: true });
    } catch (e) {
      alert('로그인 실패');
    }
  };

  const logout = async () => {
    try {
      await postLogout();
    } finally {
      removeLocalStorage(LOCAL_STORAGE_KEY.accessToken);
      removeLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
      _setAccessToken(null);
      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider 필요');
  return ctx;
};
