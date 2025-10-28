import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useNavigate } from 'react-router-dom'
import "../styles/RegisterForm.css"

const validationSchema = Yup.object({
  username: Yup.string().required("El nombre es obligatorio"),
  email: Yup.string().email("Email inválido").required("El email es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria")
})

export default function RegisterForm() {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (values, { resetForm }) => {
    const success = await register(values.username, values.email, values.password)
    if (success) {
      resetForm()
      setTimeout(() => navigate('/'), 2000)
    }
  }

  return (
    <div className='register-container'>
      <h2>Crear cuenta</h2>
      <Formik
        initialValues={{ username: '', email: '', password: '', role: 'user' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className='register-form'>
            <div className='form-field'>
              <label>Nombre</label>
              <Field as={InputText} id='username' name='username' />
              <ErrorMessage name='username' component='small' className='error' />
            </div>
            <div className='form-field'>
              <label>Email</label>
              <Field as={InputText} id='email' name='email' />
              <ErrorMessage name='email' component='small' className='error' />
            </div>
            <div className='form-field'>
              <label>Contraseña</label>
              <Field as={InputText} id='password' name='password' type='password' />
              <ErrorMessage name='password' component='small' className='error' />
            </div>
            <Button type='submit' label={isSubmitting ? "Registrando..." : "Registrarse"} />
          </Form>
        )}
      </Formik>
    </div>
  )
}
