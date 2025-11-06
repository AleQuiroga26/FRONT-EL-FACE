import React, { createContext, useState, useContext, useEffect } from "react"
import { toast } from "react-toastify"
import { AuthContext } from "./AuthContext"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const { token } = useContext(AuthContext)

  // obtener todos los usuarios activos
  const fetchUsers = async () => {
    if (!token) return
    try {
      const response = await fetch("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Error al obtener usuarios")

      setUsers(data.users)
    } catch (error) {
      console.error(error)
      toast.error("Error al cargar los usuarios")
    }
  }

  /* Registrar nuevo usuario */
  const registerUser = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al registrar usuario")
        return
      }

      toast.success("Usuario registrado exitosamente")
      setUsers((prev) => [...prev, data.user])
    } catch (error) {
      console.error(error)
      toast.error("Error al registrar el usuario")
    }
  }

 /* Desactivar usuario (eliminar logico) */
  const deactivateUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al desactivar el usuario")
        return
      }

      toast.info("Usuario desactivado correctamente")
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (error) {
      console.error(error)
      toast.error("Error al desactivar el usuario")
    }
  }

 /*  Reactivar usuario (solo admin)  */
  const reactivateUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al reactivar el usuario")
        return
      }

      toast.success(data.message)
      fetchUsers()
    } catch (error) {
      console.error(error)
      toast.error("Error al reactivar el usuario")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  return (
    <UserContext.Provider
      value={{
        users,
        fetchUsers,
        registerUser,
        deactivateUser,
        reactivateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
