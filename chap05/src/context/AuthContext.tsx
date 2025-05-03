// AuthContext.tsx
// src/context/AuthContext.tsx
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { RequestSigninDto } from "../types/authTypes";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/authApi";

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
  const {
    storedValue: accessTokenStored,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage<string | null>(LOCAL_STORAGE_KEY.accessToken, null);

  const {
    storedValue: refreshTokenStored,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage<string | null>(LOCAL_STORAGE_KEY.refreshToken, null);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setAccessToken(accessTokenStored);
    setRefreshToken(refreshTokenStored);
    setIsInitialized(true);
  }, [accessTokenStored, refreshTokenStored]);

  const login = async (signinData: RequestSigninDto) => {
    try {
      const response = await postSignin(signinData);
      const { access_token, refresh_token } = response;

      setAccessToken(access_token);
      setRefreshToken(refresh_token);

      setAccessTokenInStorage(access_token);
      setRefreshTokenInStorage(refresh_token);

      alert("Login successful");
      window.location.href = "/my";
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      alert("Logout successful");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
      alert("Logout failed. Please try again.");
    }
  };

  if (!isInitialized) return null;

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없음");
  }
  return context;
};


