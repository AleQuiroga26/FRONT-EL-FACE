import { useContext, useState, useEffect } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import Navbar from "./Navbar";

export default function CreateCategory() {
  const { createCategory } = useContext(CategoryContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Solo admin puede acceder
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    await createCategory(name, description);
    setName("");
    setDescription("");
    navigate("/dashboard"); // Volver al dashboard después de crear
  };

  return (
    <div className="p-4">
      <Navbar/>
      <Card title="Crear Nueva Categoría" className="p-card">
        <form onSubmit={handleSubmit} className="flex flex-column gap-3">
          <div className="flex flex-column">
            <label>Nombre</label>
            <InputText
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la categoría"
            />
          </div>

          <div className="flex flex-column">
            <label>Descripción</label>
            <InputTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción de la categoría"
              rows={3}
              autoResize
            />
          </div>

          <Button label="Crear Categoría" type="submit" icon="pi pi-plus" />
        </form>
      </Card>
    </div>
  );
}
