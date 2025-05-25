export const tokenStorage = {
    getAccessToken: () => localStorage.getItem("accessToken"),
    setAccessToken: (v: string) => localStorage.setItem("accessToken", v),
    removeAccessToken: () => localStorage.removeItem("accessToken"),
  
    getRefreshToken: () => localStorage.getItem("refreshToken"),
    setRefreshToken: (v: string) => localStorage.setItem("refreshToken", v),
    removeRefreshToken: () => localStorage.removeItem("refreshToken"),
  };
  