import { useLocation, Navigate, Outlet } from "react-router-dom";

export const RequireAuth = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
