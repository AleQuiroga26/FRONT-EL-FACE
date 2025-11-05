import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Si hay sesión, no puede acceder a rutas públicas redirige a la home
  // Si no hay sesión, deja acceder
  return user ? <Navigate to="/" /> : children;
};

export default PublicRoute;