import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useNavigate } from 'react-router-dom'
import "../styles/LoginForm.css"

// Validación del formulario
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
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <div className="form-field">
              <label>Nombre de usuario</label>
              <Field as={InputText} id="username" name="username" />
              <ErrorMessage name="username" component="small" className="error" />
            </div>

            <div className="form-field">
              <label>Contraseña</label>
              <Field
                as={InputText}
                id="password"
                name="password"
                type="password"
              />
              <ErrorMessage name="password" component="small" className="error" />
            </div>

            <Button
              type="submit"
              label={isSubmitting ? "Ingresando..." : "Ingresar"}
              disabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </div>
  )
}
