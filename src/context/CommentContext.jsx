import React, { createContext, useState, useEffect, useContext } from "react"
import { toast } from "react-toastify"
import { AuthContext } from "./AuthContext"

export const CommentContext = createContext()

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([])
  const { token } = useContext(AuthContext)

  // === Obtener todos los comentarios visibles ===
  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:5000/comments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Error al obtener comentarios")

      setComments(data.comments)
    } catch (error) {
      console.error(error)
      toast.error("Error al cargar los comentarios")
    }
  }

  // === Crear comentario ===
  const createComment = async (text, post_id) => {
    if (!token) {
      toast.error("Debes iniciar sesión para comentar")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, post_id }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al crear el comentario")
        return
      }

      toast.success("Comentario creado exitosamente")
      setComments((prev) => [...prev, data.comment])
    } catch (error) {
      console.error(error)
      toast.error("Error al crear el comentario")
    }
  }

  // === Actualizar comentario ===
  const updateComment = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al actualizar el comentario")
        return
      }

      setComments((prev) =>
        prev.map((c) => (c.id === id ? data.comment : c))
      )
      toast.success("Comentario actualizado exitosamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al actualizar el comentario")
    }
  }

  // === Eliminar comentario (ocultar) ===
  const deleteComment = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/comments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al eliminar el comentario")
        return
      }

      setComments((prev) => prev.filter((c) => c.id !== id))
      toast.info("Comentario eliminado exitosamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al eliminar el comentario")
    }
  }

  useEffect(() => {
    if (token) fetchComments()
  }, [token])

  return (
    <CommentContext.Provider
      value={{
        comments,
        fetchComments,
        createComment,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  )
}
