import React, { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken)
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded)
          setToken(storedToken)
        } else {
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Token inválido', error)
        localStorage.removeItem('token')
      }
    }
  }, [])

  // 🔹 LOGIN
  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        toast.error('Credenciales incorrectas')
        return false
      }

      const data = await response.json()
      const jwtToken = data.access_token

      if (!jwtToken) {
        toast.error('No se recibió el token')
        return false
      }

      localStorage.setItem('token', jwtToken)
      const decoded = jwtDecode(jwtToken)
      setUser(decoded)
      setToken(jwtToken)

      toast.success('Inicio de sesión exitoso')
      return true
    } catch (error) {
      toast.error('Hubo un error al iniciar sesión', error.message)
      return false
    }
  }

  // 🔹 REGISTER
  const register = async (username, email, password, role = 'user') => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.error || 'Error al registrar el usuario')
        return false
      }

      toast.success('Usuario registrado exitosamente')
      return true
    } catch (error) {
      toast.error('Hubo un error con el servidor', error.message)
      return false
    }
  }

  // 🔹 LOGOUT
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
    toast.info('Sesión cerrada')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
