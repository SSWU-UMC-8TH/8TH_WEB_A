// src/context/AuthContext.tsx
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { RequestSigninDto } from "../types/authTypes";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/authApi";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage<string | null>(LOCAL_STORAGE_KEY.accessToken, null);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage<string | null>(LOCAL_STORAGE_KEY.refreshToken, null);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );

  const login = async (signinData: RequestSigninDto) => {
    console.log('🚀 AuthContext.login 시작', signinData);
    try {
      const { access_token, refresh_token } = await postSignin(signinData);
      console.log('✅ postSignin 응답', { access_token, refresh_token });

      setAccessTokenInStorage(access_token);
      console.log('🛠️ 로컬스토리지에 accessToken 저장');

      setRefreshTokenInStorage(refresh_token);
      console.log('🛠️ 로컬스토리지에 refreshToken 저장');

      setAccessToken(access_token);
      console.log('🛠️ state에 accessToken 반영');

      setRefreshToken(refresh_token);
      console.log('🛠️ state에 refreshToken 반영');

      alert('Login successful');
      console.log('👍 Alert 호출 완료, navigate 전');

      navigate('/my', { replace: true });
      console.log('👣 navigate("/my") 호출');
    } catch (error) {
      console.error('❌ AuthContext.login 에러', error);
      alert('Login failed. Please try again.');
    }
  };

  const logout = async () => {
    console.log('🚀 AuthContext.logout 시작');
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      console.log('🔒 토큰 삭제 완료, 로그아웃 처리');
      alert('Logout successful');
      navigate('/', { replace: true });
      console.log('👣 navigate("/") 호출');
    } catch (error) {
      console.error('❌ AuthContext.logout 에러', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
