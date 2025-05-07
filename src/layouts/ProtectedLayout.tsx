import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { HomeLayout } from "./HomeLayout";

export const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to={'/login'} state={{location}} replace/>;
  }

  return (
    <HomeLayout />
  ); //토큰이 있으면 아웃렛을 보여줌
}
