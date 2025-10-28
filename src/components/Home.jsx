import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <div className="left-section">
                <img src="/logo_face1.png" alt="logo" className="logo-img" />
                <h1 className="logo-text">elFace</h1>
                <p className="description">
                    elFace te ayuda a comunicarte y compartir con las personas que forman parte de tu vida.
                </p>
            </div>

            <div className="right-section">
                <div className="login-box">
                    <Button 
                        label="Iniciar sesion" 
                        className="login-btn" 
                        onClick={() => navigate("/login")} 
                    />
                    <Button 
                        label="Crear una cuenta" 
                        className="register-btn" 
                        onClick={() => navigate("/registrarse")} 
                    />
                </div>
            </div>
        </div>
    );
}
