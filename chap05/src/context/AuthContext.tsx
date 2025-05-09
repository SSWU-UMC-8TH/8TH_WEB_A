// src/context/AuthContext.tsx
import { createContext, PropsWithChildren, useContext, useState, useEffect } from 'react';
import { postSignin, postLogout, getMyInfo } from '../apis/authApi';
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from '../utils/localStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { RequestSigninDto, ResponseMyInfoDto } from '../types/authTypes';

interface AuthContextType {
  accessToken: string | null;
  user: ResponseMyInfoDto | null;
  login: (data: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, _setAccessToken] = useState<string | null>(
    getLocalStorage(LOCAL_STORAGE_KEY.accessToken)
  );
  const [user, setUser] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const userInfo = await getMyInfo();
          setUser(userInfo);
        } catch (e) {
          console.error('유저 정보 가져오기 실패:', e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [accessToken]);

  const login = async (signinData: RequestSigninDto) => {
    const { access_token, refresh_token } = await postSignin(signinData);
    setLocalStorage(LOCAL_STORAGE_KEY.accessToken, access_token);
    setLocalStorage(LOCAL_STORAGE_KEY.refreshToken, refresh_token);
    _setAccessToken(access_token);
  };

  const logout = async () => {
    try {
      await postLogout();
    } finally {
      removeLocalStorage(LOCAL_STORAGE_KEY.accessToken);
      removeLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
      _setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider 필요');
  return ctx;
};
