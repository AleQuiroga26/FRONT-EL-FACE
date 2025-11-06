import React, { createContext, useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from './AuthContext'

export const PostContext = createContext()

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const { token } = useContext(AuthContext)

  /*  Obtener todos los posts  */
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/posts')
      if (!response.ok) throw new Error('Error al obtener los posts')

      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar los posts')
    }
  }

 /* Crear un nuevo post */
  const createPost = async (title, content, category_id) => {
    if (!token) {
      toast.error('Debes iniciar sesión para crear un post')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, category_id })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al crear el post')
        return
      }

      toast.success('Post creado exitosamente')
      setPosts(prev => [...prev, data.post])
    } catch (error) {
      console.error(error)
      toast.error('Error al crear el post')
    }
  }

   /* Editar post  */
  const updatePost = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      })

      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || 'Error al actualizar el post')
        return
      }

      setPosts(prev =>
        prev.map(p => (p.id === id ? data.post : p))
      )
      toast.success('Post actualizado exitosamente')
    } catch (error) {
      toast.error('Error al actualizar el post')
    }
  }

 /* Eliminar post  */
  const deletePost = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || 'Error al eliminar el post')
        return
      }

      setPosts(prev => prev.filter(p => p.id !== id))
      toast.info('Post eliminado exitosamente')
    } catch (error) {
      toast.error('Error al eliminar el post')
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <PostContext.Provider
      value={{
        posts,
        fetchPosts,
        createPost,
        updatePost,
        deletePost
      }}
    >
      {children}
    </PostContext.Provider>
  )
}
