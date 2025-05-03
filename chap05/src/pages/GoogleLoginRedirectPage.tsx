import { useEffect } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { set } from "react-hook-form";

export const GoogleLoginRedirectPage = () => {
  const {setItem:setAccessToken} = useLocalStorage<string | null>(LOCAL_STORAGE_KEY.accessToken, null);
  const {setItem:setRefreshToken} = useLocalStorage<string | null>(LOCAL_STORAGE_KEY.refreshToken, null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    console.log(urlParams.get("name"))
    const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken)
    const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken)

    if (accessToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      window.location.href = "/my";
    }
  }, [setAccessToken, setRefreshToken]);

  return (
    <div>GoogleLoginRedirectPage</div>
  )
}