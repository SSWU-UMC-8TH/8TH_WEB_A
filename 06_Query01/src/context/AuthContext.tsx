import { useState, useEffect } from "react";
import { PropsWithChildren } from "react";
import { createContext } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { RequestSigninDto } from "../types/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async (_: RequestSigninDto) => {}, // ✅ 타입 일치
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { getItem: getAccessTokenFromStorage, setItem: setAccessTokenInStorage, removeItem: removeAccessTokenFromStorage } =
    useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { getItem: getRefreshTokenFromStorage, setItem: setRefreshTokenInStorage, removeItem: removeRefreshTokenFromStorage } =
    useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    setAccessToken(getAccessTokenFromStorage());
    setRefreshToken(getRefreshTokenFromStorage());
  }, []);

  const login = async (signinData: RequestSigninDto) => {
    const fakeAccessToken = "dummyAccessToken";
    const fakeRefreshToken = "dummyRefreshToken";

    setAccessTokenInStorage(fakeAccessToken);
    setRefreshTokenInStorage(fakeRefreshToken);

    setAccessToken(fakeAccessToken);
    setRefreshToken(fakeRefreshToken);
  };

  const logout = async () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
