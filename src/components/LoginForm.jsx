import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import "../styles/LoginForm.css"

// Esquema de validación
const validationSchema = Yup.object({
  username: Yup.string().required("El nombre de usuario es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria")
})

export default function LoginForm() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    const success = await login(values.username, values.password)
    setSubmitting(false)

    if (success) {
      setTimeout(() => navigate('/dashboard'), 1500)
    }
  }

  return (
    <div className="login-wrapper">
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <div className="login-title">Iniciar sesión</div>

            <div className="login-content">
              <div className="profile-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                  <circle cx="32" cy="20" r="12" />
                  <path d="M8 56c0-12 10-20 24-20s24 8 24 20v4H8v-4z" />
                </svg>
              </div>

              <label htmlFor="username">Nombre de usuario</label>
              <Field
                id="username"
                name="username"
                type="text"
                placeholder="Ingrese su nombre de usuario"
                className="input"
              />
              <ErrorMessage name="username" component="small" className="error" />

              <label htmlFor="password">Contraseña</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Ingrese su contraseña"
                className="input"
              />
              <ErrorMessage name="password" component="small" className="error" />

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
