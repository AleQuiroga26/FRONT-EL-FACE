import { useContext, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Toast } from 'primereact/toast'
import { useNavigate } from 'react-router-dom'
import "../styles/RegisterForm.css"

const validationSchema = Yup.object({
  username: Yup.string().required("El nombre es obligatorio"),
  email: Yup.string().email("Email inválido").required("El correo es obligatorio"),
  password: Yup.string().min(6, "Debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
})

export default function RegisterForm() {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useRef(null)

  const handleSubmit = async (values, { resetForm }) => {
    const success = await register(values.username, values.email, values.password)
    if (success) {
      toast.current.show({
        severity: 'success',
        summary: 'Cuenta creada',
        detail: 'Registro exitoso',
        life: 3000
      })
      resetForm()
      setTimeout(() => navigate('/'), 2000)
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo registrar',
        life: 3000
      })
    }
  }

  return (
    <div className="register-3d-wrapper">
      <Toast ref={toast} position="top-center" />
      <Formik
        initialValues={{ username: '', email: '', password: '', role: 'user' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <div className="form-title">Registro</div>

            <div className="form-content">
              <div className="profile-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                  <circle cx="32" cy="20" r="12" />
                  <path d="M8 56c0-12 10-20 24-20s24 8 24 20v4H8v-4z" />
                </svg>
              </div>

              <label htmlFor="username">Nombre</label>
              <Field
                id="username"
                name="username"
                type="text"
                placeholder="Ingrese su nombre completo"
                className="input"
              />
              <ErrorMessage name="username" component="small" className="error" />

              <label htmlFor="email">Correo electrónico</label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Introduce tu correo electrónico"
                className="input"
              />
              <ErrorMessage name="email" component="small" className="error" />

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
                {isSubmitting ? "Cargando..." : "Registrarse"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
