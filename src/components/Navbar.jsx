import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CategoryContext } from "../context/CategoryContext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Menubar } from "primereact/menubar";
import "../styles/Navbar.css";

export default function Navbar({ onLogout }) {
  const { user } = useContext(AuthContext);
  const { categories } = useContext(CategoryContext);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.body.className = isDarkMode ? "dark-mode" : "";
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const menuItems = [
    { label: "Inicio", icon: "pi pi-home", command: () => navigate("/dashboard") },
    { label: "Mi Perfil", icon: "pi pi-user", command: () => navigate("/perfil") },
    ...(user?.role === "admin"
      ? [{ label: "Crear categoría", icon: "pi pi-plus", command: () => navigate("/crear-categoria") }]
      : []),
    { label: "Cerrar sesión", icon: "pi pi-sign-out", command: onLogout },
  ];

  return (
    <div className="navbar-container">
      <Menubar
        className="retro-topbar-gray"
        start={
          <div className="logo-section">
            <img src="/logo_face1.png" alt="logo" className="logo-img-sm" />
            <h3 className="logo-text">elFace</h3>
          </div>
        }
        end={
          <div className="nav-controls">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                icon={item.icon}
                label={item.label}
                className="retro-btn"
                onClick={item.command}
              />
            ))}
            <Button
              icon={isDarkMode ? "pi pi-sun" : "pi pi-moon"}
              className="retro-btn"
              onClick={toggleTheme}
              tooltip={isDarkMode ? "Modo día" : "Modo noche"}
            />
            <Avatar
              label={user?.username?.[0]?.toUpperCase() || "U"}
              shape="circle"
              size="large"
              className="user-avatar"
            />
          </div>
        }
      />
    </div>
  );
}
