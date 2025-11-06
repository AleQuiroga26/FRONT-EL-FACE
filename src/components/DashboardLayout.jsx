import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import { CommentContext } from "../context/CommentContext";
import { CategoryContext } from "../context/CategoryContext";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { ScrollPanel } from "primereact/scrollpanel";
import { Dropdown } from "primereact/dropdown";

import Navbar from "./Navbar";
import "../styles/DashboardLayout.css";

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const { posts, createPost, fetchPosts, deletePost, updatePost } = useContext(PostContext);
  const { createComment } = useContext(CommentContext);
  const { categories, fetchCategories } = useContext(CategoryContext);

  const navigate = useNavigate();

  // === Estados principales ===
  const [newTitle, setNewTitle] = useState("");
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newComments, setNewComments] = useState({});

  // === Edición de post ===
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState(null);

  // === Modo oscuro ===
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  // === Cargar datos al inicio ===
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchPosts(), fetchCategories()]);
    };
    loadData();
  }, []);

  // === Logout ===
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // === Crear nuevo post ===
  const handlePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPost.trim() || !selectedCategory) return;

    await createPost(newTitle, newPost, selectedCategory.id);
    setNewTitle("");
    setNewPost("");
    setSelectedCategory(null);
    await fetchPosts();
  };

  // === Crear comentario ===
  const handleComment = async (postId) => {
    const commentText = newComments[postId]?.trim();
    if (!commentText) return;

    await createComment(commentText, postId);
    await fetchPosts();
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
  };

  // === Iniciar edición de post ===
  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
  };

  // === Guardar post editado ===
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;

    await updatePost(editingPost.id, {
      title: editTitle,
      content: editContent,
      category_id: editCategory?.id,
    });

    setEditingPost(null);
    await fetchPosts();
  };

  return (
    <div className={`layout-wrapper ${darkMode ? "dark-mode" : ""}`}>
      <Navbar
        onLogout={handleLogout}
        isDarkMode={darkMode}
        toggleTheme={() => setDarkMode((prev) => !prev)}
      />

      <div className="layout-content">
        <main className="retro-feed-gray">

          {/* === Crear publicación === */}
          <Card title="Crear publicación" className="feed-card-gray">
            <form onSubmit={handlePost} className="new-post-form-gray">
              <div className="post-inputs-row">
                <Avatar
                  label={user?.username?.[0]?.toUpperCase() || "U"}
                  shape="circle"
                  size="large"
                  className="post-avatar"
                />
                <div className="flex flex-column gap-2" style={{ flex: 1 }}>
                  <InputTextarea
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Título de la publicación"
                    className="p-inputtext p-component w-full"
                    required
                  />
                  <InputTextarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={2}
                    placeholder="¿Qué estás pensando?"
                    autoResize
                    className="post-textarea"
                  />
                </div>
                <Dropdown
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.value)}
                  options={categories}
                  optionLabel="name"
                  placeholder="Selecciona una categoría"
                  className="post-dropdown"
                />
                <Button
                  label="Publicar"
                  icon="pi pi-send"
                  type="submit"
                  className="post-button"
                />
              </div>
            </form>
          </Card>

          {/* === Formulario de edición de publicación === */}
          {editingPost && (
            <Card title="Editar publicación" className="feed-card-gray">
              <form onSubmit={handleUpdatePost} className="new-post-form-gray">
                <InputTextarea
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Nuevo título"
                  className="p-inputtext p-component w-full"
                  required
                />
                <InputTextarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  placeholder="Nuevo contenido"
                  className="post-textarea"
                  autoResize
                />
                <Dropdown
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.value)}
                  options={categories}
                  optionLabel="name"
                  placeholder="Selecciona una categoría"
                  className="post-dropdown"
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    label="Guardar cambios"
                    icon="pi pi-check"
                    type="submit"
                    className="p-button-success"
                  />
                  <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    className="p-button-secondary"
                    onClick={() => setEditingPost(null)}
                    type="button"
                  />
                </div>
              </form>
            </Card>
          )}

          <Divider />

          {/* === Mostrar publicaciones === */}
          <ScrollPanel style={{ width: "100%", height: "70vh" }}>
            {posts.length === 0 ? (
              <p className="text-center mt-4">Aún no hay publicaciones</p>
            ) : (
              posts.map((post) => {
                const postComments = post.comments || [];
                return (
                  <Card
                    key={post.id}
                    className="post-card-gray mb-3"
                    header={
                      <div className="flex align-items-center gap-2">
                        <Avatar
                          label={post.author?.username?.[0]?.toUpperCase() || "U"}
                          size="normal"
                          shape="circle"
                          style={{
                            backgroundColor: "#ccd8ff",
                            color: "#003399",
                          }}
                        />
                        <div>
                          <strong>@{post.author?.username || "Usuario"}</strong>
                          <p className="text-sm text-gray-500 m-0">
                            {post.category?.name || "Sin categoría"}
                          </p>
                        </div>
                        {(post.author?.id === user?.id ||
                          user?.role === "admin" ||
                          user?.role === "moderator") && (
                          <div className="ml-auto flex gap-2">
                            <Button
                              icon="pi pi-pencil"
                              className="p-button-rounded p-button-text p-button-warning"
                              tooltip="Editar post"
                              onClick={() => handleEditClick(post)}
                            />
                            <Button
                              icon="pi pi-trash"
                              className="p-button-rounded p-button-text p-button-danger"
                              tooltip="Eliminar post"
                              onClick={async () => {
                                const confirmed = window.confirm(
                                  "¿Seguro que deseas eliminar este post?"
                                );
                                if (!confirmed) return;
                                await deletePost(post.id);
                                await fetchPosts();
                              }}
                            />
                          </div>
                        )}
                      </div>
                    }
                  >
                    <h3 className="m-0 mb-2">{post.title}</h3>
                    <p className="m-0">{post.content}</p>
                    <p className="text-sm text-gray-400 mb-3">
                      Publicado el:{" "}
                      {new Date(post.created_at).toLocaleString("es-AR")}
                    </p>

                    <Divider />
                    <div className="comments-section">
                      <p className="text-sm text-gray-500 mb-2">
                        {postComments.length} comentario
                        {postComments.length !== 1 ? "s" : ""}
                      </p>

                      {postComments.length > 0 ? (
                        postComments.map((c) => (
                          <div
                            key={c.id}
                            className="comment mb-2"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <strong>@{c.author?.username || "Anon"}</strong>:{" "}
                              {c.text}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">
                          Sé el primero en comentar
                        </p>
                      )}

                      <div className="flex align-items-center gap-2 mt-2">
                        <InputTextarea
                          value={newComments[post.id] || ""}
                          onChange={(e) =>
                            setNewComments((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          rows={1}
                          placeholder="Escribe un comentario..."
                          autoResize
                          className="flex-1"
                        />
                        <Button
                          icon="pi pi-send"
                          className="p-button-text"
                          onClick={() => handleComment(post.id)}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </ScrollPanel>
        </main>
      </div>
    </div>
  );
}
