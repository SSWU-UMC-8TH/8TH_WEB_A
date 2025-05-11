import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const accessToken = localStorage.getItem("accessToken");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!accessToken) {
      const confirmed = window.confirm("로그인이 필요한 서비스입니다. 로그인하시겠습니까?");
      if (confirmed) {
        setShouldRedirect(true);
      }
    }
  }, [accessToken]);

  if (!accessToken) {
    if (shouldRedirect) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
