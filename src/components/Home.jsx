import { useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "../styles/Home.css";

export default function Home() {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useRef(null);

  // Flip card toggle
  useEffect(() => {
    const toggle = document.querySelector(".toggle");
    const cardInner = document.querySelector(".flip-card__inner");

    const handleFlip = () => cardInner.classList.toggle("flipped", toggle.checked);

    if (toggle && cardInner) {
      toggle.addEventListener("change", handleFlip);
    }
    return () => {
      if (toggle && cardInner) toggle.removeEventListener("change", handleFlip);
    };
  }, []);

  // Validaciones
  const loginSchema = Yup.object({
    username: Yup.string().required("Nombre de usuario obligatorio"),
    password: Yup.string().required("Contraseña obligatoria"),
  });

  const registerSchema = Yup.object({
    username: Yup.string().required("Nombre obligatorio"),
    email: Yup.string().email("Email inválido").required("Correo obligatorio"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña obligatoria"),
  });

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
        <Toast ref={toast} position="top-center" />
        <div className="wrapper">
          <div className="card-switch">
            <label className="switch">
              <input type="checkbox" className="toggle" />
              <span className="slider"></span>
              <span className="card-side"></span>

              <div className="flip-card__inner">
                {/* -------------------- LOGIN -------------------- */}
                <div className="flip-card__front">
                  <div className="title">Inicia Sesión!</div>
                  <Formik
                    initialValues={{ username: "", password: "" }}
                    validationSchema={loginSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                      const success = await login(values.username, values.password);
                      setSubmitting(false);
                      if (success) navigate("/dashboard");
                      // Los errores se manejan dentro de la función login
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form className="flip-card__form">
                        <Field
                          className="flip-card__input"
                          name="username"
                          type="text"
                          placeholder="Nombre de usuario"
                        />
                        <ErrorMessage name="username" component="small" className="error" />

                        <Field
                          className="flip-card__input"
                          name="password"
                          type="password"
                          placeholder="Contraseña"
                        />
                        <ErrorMessage name="password" component="small" className="error" />

                        <button className="flip-card__btn" type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Ingresando..." : "Siguiente"}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>

                {/* -------------------- REGISTER -------------------- */}
                <div className="flip-card__back">
                  <div className="title">Registrate!</div>
                  <Formik
                    initialValues={{ username: "", email: "", password: "" }}
                    validationSchema={registerSchema}
                    onSubmit={async (values, { resetForm }) => {
                      const success = await register(values.username, values.email, values.password);
                      if (success) {
                        toast.current.show({
                          severity: "success",
                          summary: "Cuenta creada",
                          detail: "Registro exitoso",
                          life: 3000,
                        });
                        resetForm();
                        setTimeout(() => navigate("/"), 2000);
                      }
                      // Los errores se manejan dentro de la función register
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form className="flip-card__form">
                        <Field
                          className="flip-card__input"
                          name="username"
                          type="text"
                          placeholder="Nombre"
                        />
                        <ErrorMessage name="username" component="small" className="error" />

                        <Field
                          className="flip-card__input"
                          name="email"
                          type="email"
                          placeholder="Email"
                        />
                        <ErrorMessage name="email" component="small" className="error" />

                        <Field
                          className="flip-card__input"
                          name="password"
                          type="password"
                          placeholder="Contraseña"
                        />
                        <ErrorMessage name="password" component="small" className="error" />

                        <button className="flip-card__btn" type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Cargando..." : "Registrar"}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
