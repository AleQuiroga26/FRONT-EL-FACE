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
  const { posts, createPost, fetchPosts, deletePost } = useContext(PostContext);
  const { createComment, deleteComment } = useContext(CommentContext);
  const { categories, fetchCategories } = useContext(CategoryContext);

  const navigate = useNavigate();
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newComments, setNewComments] = useState({});

  // === Estado para modo oscuro ===
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  // === Cargar publicaciones y categorías al iniciar ===
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
    if (!newPost.trim() || !selectedCategory) return;

    await createPost("Sin título", newPost, selectedCategory.id);
    setNewPost("");
    setSelectedCategory(null);
    await fetchPosts(); // refrescar publicaciones
  };

  // === Crear nuevo comentario ===
  const handleComment = async (postId) => {
    const commentText = newComments[postId]?.trim();
    if (!commentText) return;

    await createComment(commentText, postId);
    await fetchPosts(); // refrescar posts (ya incluyen comentarios)
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
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
                <InputTextarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={2}
                  placeholder="¿Qué estás pensando?"
                  autoResize
                  className="post-textarea"
                />
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
                          <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-text p-button-danger ml-auto"
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
                        )}
                      </div>
                    }
                  >
                    <p className="m-0">{post.content}</p>

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
                            style={{ display: "flex", alignItems: "center", gap: "8px" }}
                          >
                            <div style={{ flex: 1 }}>
                              <strong>@{c.author?.username || "Anon"}</strong>: {c.text}
                            </div>
                            {(c.author?.id === user?.id ||
                              user?.role === "admin" ||
                              user?.role === "moderator") && (
                              <Button
                                icon="pi pi-eye-slash"
                                className="p-button-rounded p-button-text p-button-danger"
                                tooltip="Ocultar comentario"
                                onClick={async () => {
                                  const confirmed = window.confirm(
                                    "¿Seguro que deseas ocultar este comentario?"
                                  );
                                  if (!confirmed) return;

                                  await deleteComment(c.id);
                                  await fetchPosts();
                                }}
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">Sé el primero en comentar</p>
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
