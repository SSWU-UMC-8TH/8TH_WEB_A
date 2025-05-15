import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HomeLayout } from "./HomeLayout";

export const ProtectedLayout = () => {

  return <HomeLayout />;
};
