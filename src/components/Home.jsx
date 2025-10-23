import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Bienvenido</h1>
            <div className="home-buttons">
                <Button label="Registrarse" onClick={() => navigate("/registrarse")} />
                <Button
                    label="Iniciar sesión"
                    className="p-button-secondary"
                    onClick={() => alert("Funcionalidad próximamente")}
                />
            </div>
        </div>
    );
}