import { Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import RegisterForm from "./components/RegisterForm"
import LoginForm from "./components/LoginForm"
import { AuthProvider } from "./context/AuthContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </AuthProvider>
  )
}
