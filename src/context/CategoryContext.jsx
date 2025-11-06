import React, { createContext, useState, useEffect, useContext } from "react"
import { toast } from "react-toastify"
import { AuthContext } from "./AuthContext"

export const CategoryContext = createContext()

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const { token } = useContext(AuthContext)

   /* Obtener todas las categorias */ 
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/categories")
      if (!response.ok) throw new Error("Error al obtener las categorías")

      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error(error)
      toast.error("Error al cargar las categorías")
    }
  }

 /*  Crear nueva categoria  */
  const createCategory = async (name, description) => {
    if (!token) {
      toast.error("Debes iniciar sesión para crear una categoría")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al crear la categoría")
        return
      }

      toast.success("Categoría creada exitosamente")
      setCategories((prev) => [...prev, data.category])
    } catch (error) {
      console.error(error)
      toast.error("Error al crear la categoría")
    }
  }

 /* Actualizar categoria  */
  const updateCategory = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al actualizar la categoría")
        return
      }

      setCategories((prev) =>
        prev.map((c) => (c.id === id ? data.category : c))
      )
      toast.success("Categoría actualizada exitosamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al actualizar la categoría")
    }
  }

 /*  Eliminar categoria. oculta, no borra fisicamente */
  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al eliminar la categoría")
        return
      }

      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.info("Categoría eliminada exitosamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al eliminar la categoría")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <CategoryContext.Provider
      value={{
        categories,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}
