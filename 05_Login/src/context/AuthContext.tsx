import { PropsWithChildren } from "react";
import { createContext } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "./../hooks/useLocalStorage";
import { RequestSigninDto } from "./../types/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const login = async (signinData: RequestSigninDto) => {
    // 로그인 처리 로직 구현 예정
  };

  const logout = async () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: getAccessTokenFromStorage(),
        refreshToken: getRefreshTokenFromStorage(),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
