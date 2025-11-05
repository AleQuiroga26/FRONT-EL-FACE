import { useContext, useState, useEffect } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import Navbar from "./Navbar";
import "../styles/DashboardLayout.css";

export default function CreateCategory() {
  const { createCategory } = useContext(CategoryContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Solo admin puede acceder
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user]);

  // Persistir modo oscuro
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    await createCategory(name, description);
    setName("");
    setDescription("");
    navigate("/dashboard");
  };

  return (
    <div className={`layout-wrapper ${darkMode ? "dark-mode" : ""}`}>
      <Navbar
        isDarkMode={darkMode}
        toggleTheme={() => setDarkMode((prev) => !prev)}
        onLogout={() => navigate("/")}
      />

      <div
        className="layout-content flex justify-center items-center"
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <Card
          title="Crear Nueva Categoría"
          className="feed-card-gray"
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-column items-center gap-4 w-full"
          >
            {/* Nombre */}
            <div className="flex flex-column items-center w-full">
              <label className="text-sm font-bold mb-1">Nombre</label>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de la categoría"
                className="p-inputtext-sm"
                style={{ width: "100%", maxWidth: "400px" }}
              />
            </div>

            {/* Descripción */}
            <div className="flex flex-column items-center w-full">
              <label className="text-sm font-bold mb-1">Descripción</label>
              <InputTextarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción de la categoría"
                rows={3}
                autoResize
                className="p-inputtextarea-sm"
                style={{ width: "100%", maxWidth: "400px" }}
              />
            </div>

            {/* Botón Crear */}
            <Button
              label="Crear Categoría"
              type="submit"
              icon="pi pi-plus"
              className="p-button-sm p-button-primary"
              style={{ maxWidth: "200px" }}
            />
          </form>
        </Card>
      </div>
    </div>
  );
}
