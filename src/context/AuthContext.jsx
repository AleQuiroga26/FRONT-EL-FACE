import React, { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          // El ID puede venir como "sub" o "identity"
          const userId = decoded.sub || decoded.identity || decoded.id;
          if (userId) fetchUserProfile(userId, storedToken);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Token inválido", error);
        localStorage.removeItem("token");
      }
    }
  }, []);


  const fetchUserProfile = async (userId, jwtToken) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al cargar perfil");

      setUser(data); // Guarda los datos completos (username, email, role...)
    } catch (error) {
      console.error("Error cargando perfil:", error);
    }
  };

  // LOGIN
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
      setToken(jwtToken)
      const userId = decoded.sub || decoded.identity || decoded.id;
      if (userId) {
        await fetchUserProfile(userId, jwtToken);
      }
      toast.success('Inicio de sesión exitoso')
      return true
    } catch (error) {
      toast.error('Hubo un error al iniciar sesión', error.message)
      return false
    }
  }

  // REGISTER
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

  // LOGOUT
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
