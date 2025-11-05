import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Si hay sesión, muestra la ruta privada
  // Si no hay sesión, redirige a login
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;